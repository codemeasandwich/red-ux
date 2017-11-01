function shouldUpdate(current, next) {

  var currentKeys = Object.keys( current ),
      nextKeys    = Object.keys( next );

    if( currentKeys.length !== nextKeys.length ){
      return true;
    }

    for (const key of currentKeys) {
      if(current[key] !== next[key]) {
          return true;
      }
    }

    return false;
}

export default shouldUpdate
