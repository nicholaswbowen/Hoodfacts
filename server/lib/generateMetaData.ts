import {CityDataTag} from '../models/CityDataTag';
import {StateDataTag} from '../models/StateDataTag';
import {CityTagsMetaData} from '../models/CityTagsMetaData';
import {StateTagsMetaData} from '../models/StateTagsMetaData';
export const generateMetaData = () => {
  CityTagsMetaData.remove({}, () => {
    console.log('cleared city metadata')
  })
  StateTagsMetaData.remove({}, () => {
    console.log('cleared state metadata')
  })

  function findTags(tagsType,metaDataType){
    let query:any = {};

    generateTags()
      .then((resultTags:any) => {
        resultTags.forEach((tagSubtypes,tagType) => {
          metaDataType.create({type:tagType,subtypes:tagSubtypes})
            .then((result) => {
              console.log(`created tags with id: ${result._id}`);
            })
            .catch((e) => {
              console.log(e);
            })
          })
      })


    function generateTags(){
      return new Promise((resolve, reject) => {
        let resultTags = new Map();
        let tagQuerys = [];
        makeQuery();
        function makeQuery(){
          tagsType.findOne(query, (error, result) => {
            if (result){
              let check = resultTags.get(result.type);
              if(check){
                check.push(result.subtype);
                resultTags.set(result.type,check);
              }else{
                resultTags.set(result.type,[result.subtype]);
              }
              if (!query.$and){
                Object.assign(query,{$and: []});
              }
              query.$and.push({subtype:{$ne:result.subtype}});
              return makeQuery();
            }else{
              resolve(resultTags);
            }
          })
        }
      })
    }
  }
  findTags(StateDataTag,StateTagsMetaData);
  findTags(CityDataTag,CityTagsMetaData);
}
