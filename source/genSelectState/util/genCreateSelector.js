
import { createSelector } from 'reselect'

//=====================================================
//===================================== create selector
//=====================================================

function genCreateSelector(args,work){
//  console.log(args)
//  console.log(work)
  if(Array.isArray(args) && args.length === work.length && work.length > 1){
    const argsX = args.map( (x,i) => ("function" === typeof x) ? x : y => y[i] )
    return createSelector(...argsX,work);
  } else if("function" === typeof args){
    return createSelector(args,work)
  }
  return createSelector(x=>x,work)
}

export default genCreateSelector
