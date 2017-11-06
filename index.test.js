
import { shouldUpdate, genSelectState } from './source/index'

//=====================================================
//====================================== genSelectState
//=====================================================

describe('genSelectState - result caching', () => {

let map_to_props_fn, map_to_props_obj, state;


beforeEach(() => {

  map_to_props_fn = (state)=>({
    user  : state.user,
    posts : state.posts
  })

  map_to_props_obj = {
    user  : state => state.user,
    posts : state => state.posts
  }

  state = {
    user:{name:"Bri"},
    posts:[{uid:123,userName:"Tom"}]
  }

});

//++++++++++++++++++++++++++ should cache results - fn
//++++++++++++++++++++++++++++++++++++++++++++++++++++

    it('should cache results - fn', () => {

      const mockCallback = jest.fn();
      mockCallback.mockReturnValue(123)

      const works = {
        posts : (posts)=>{
          expect(posts).toBe(state.posts);
          return mockCallback()
        }
      }

      const connect = genSelectState( map_to_props_fn, works );

      expect(connect(state).posts).toBe(123); // call 1
      expect(connect(state).posts).toBe(123); // call 2

      expect(mockCallback.mock.calls.length).toBe(1);
    })

//+++++++++++++++++++++++++ should cache results - obj
//++++++++++++++++++++++++++++++++++++++++++++++++++++

    it('should cache results - obj', () => {

      const mockCallback = jest.fn();
      mockCallback.mockReturnValue(123)

      const works = {
        posts : (posts)=>{
          expect(posts).toBe(state.posts);
          return mockCallback()
        }
      }

      const connect = genSelectState( map_to_props_obj, works );

      expect(connect(state).posts).toBe(123); // call 1
      expect(connect(state).posts).toBe(123); // call 2

      expect(mockCallback.mock.calls.length).toBe(1);
    })

//+++++++++++++ should cache results(muilt-value) - fn
//++++++++++++++++++++++++++++++++++++++++++++++++++++

    it('should cache results(muilt-value) - fn', () => {

      const mockCallback = jest.fn();
      mockCallback.mockReturnValue(123)

      const map_to_props = (state)=>({
        user  : state.user,
        posts : ["cats","dogs"]//[state.foo,state.bar]
      })

      const works = {
        posts : (cats,dogs)=>{
          expect(cats).toBe("cats");
          expect(dogs).toBe("dogs");
          return mockCallback()
        }
      }

      const connect = genSelectState( map_to_props, works );

      expect(connect(state).posts).toBe(123); // call 1
      expect(connect(state).posts).toBe(123); // call 2

      expect(mockCallback.mock.calls.length).toBe(1);
    })

//++++++++++++ should cache results(muilt-value) - obj
//++++++++++++++++++++++++++++++++++++++++++++++++++++

    it('should cache results(muilt-value) - obj', () => {

      const mockCallback = jest.fn();
      mockCallback.mockReturnValue(123)

      const map_to_props = {
        user  : state => state.user,
        posts :  [() =>"cats",
                  () =>"dogs"]
      }

      const works = {
        posts : (cats,dogs)=>{
          expect(cats).toBe("cats");
          expect(dogs).toBe("dogs");
          return mockCallback()
        }
      }

      const connect = genSelectState( map_to_props, works );

      expect(connect(state).posts).toBe(123); // call 1
      expect(connect(state).posts).toBe(123); // call 2

      expect(mockCallback.mock.calls.length).toBe(1);
    })

//+++++++++++ should return map_to_props if no workers
//++++++++++++++++++++++++++++++++++++++++++++++++++++

    it('should return map_to_props if no workers - fn', () => {

      const connect = genSelectState( map_to_props_fn );

      expect(connect(state).posts).toEqual(state.posts);
      //expect(connect(state).posts).toEqual([{uid:123,userName:"Tom"}]);

    })

//+++++++++++ should return map_to_props if no workers
//++++++++++++++++++++++++++++++++++++++++++++++++++++

    it('should return map_to_props if no workers - obj', () => {
      map_to_props_obj.grauit = x =>"uier"
      const connect = genSelectState( map_to_props_obj );

      expect(connect(state)).toEqual({
        user:state.user,
        posts:state.posts,
        grauit:"uier"
      });
    //expect([{uid:123,userName:"Tom", grauit:"uier"}]).toEqual(connect(state).posts);

    })

//++++++++++++++++++++ should cache results - reselect
//++++++++++++++++++++++++++++++++++++++++++++++++++++

    it('should cache results - reselect', () => {

      const mockCallback = jest.fn();
      mockCallback.mockReturnValue(123)

      const works = {
        posts : mockCallback
      }

      const connect = genSelectState( map_to_props_obj, works );

      expect(connect(state).posts).toBe(123); // call 1
      expect(connect(state).posts).toBe(123); // call 2

      expect(mockCallback.mock.calls.length).toBe(1);
    })

//+++++++ should cache results(muilt-value) - reselect
//++++++++++++++++++++++++++++++++++++++++++++++++++++

// !!! COVERED in "should cache results(muilt-value) - obj" !!!

    it('should cache results(muilt-value) - reselect', () => {
      const mockCallback = jest.fn();
      mockCallback.mockReturnValue(123)

      const selecters = {
        user  : state => state.user,
        posts : [state => state.foo,
                 state => state.bar]
      }

      const works = {
        posts : (foo,bar)=>{
          expect(foo).toBe(state.foo);
          expect(bar).toBe(state.bar);
          return mockCallback()
        }
      }

      state = {
        user:"bob",
        foo:"off",
        bar:"rab"
      }

      const connect = genSelectState( selecters, works );

      expect(connect(state).posts).toBe(123); // call 1
      expect(connect(state).posts).toBe(123); // call 2

      expect(mockCallback.mock.calls.length).toBe(1);
    })

//+++++++++++++++++++++ should support nasted selector
//++++++++++++++++++++++++++++++++++++++++++++++++++++

    it('should support nasted selector', () => {

      const map_to_props = (state)=>({
        user  : {
          friends:state.others
        },
        posts : state.posts
      })

      const works = {
        user  : {
          friends: others => others.map( x => x.toUpperCase() )
        }
      }

      const connect = genSelectState( map_to_props, works );

      const state = {
        others:["a","b","c"],
        posts:[{uid:123,userName:"Tom"}]
      }

      expect(connect(state).user.friends).toEqual(state.others.map(x=>x.toUpperCase()));
    })

//++++++++++ should support nasted selector - reselect
//++++++++++++++++++++++++++++++++++++++++++++++++++++

    it('should support nasted selector - reselect', () => {

      const map_to_props = {
        user  : state => ({friends:state.user.others}),
        posts : state => state.posts
      }

      const works = {
        user  : {
          friends: others => others.map( x => x.toUpperCase() )
        }
      }

      const connect = genSelectState( map_to_props, works );

      const state = {
        user:{others:["a","b","c"]},
        posts:[{uid:123,userName:"Tom"}]
      }

      expect(connect(state).user.friends).toEqual(state.others.map(x=>x.toUpperCase()));
    })

//++++++++++++ should wrap calling worker object - obj
//++++++++++++++++++++++++++++++++++++++++++++++++++++

    it('should wrap calling worker object - obj', () => {

      const A = jest.fn();
      const B = jest.fn();

      const map_to_props = {
        a:  (state)=>state.one,
        b: [(state)=>state.one,
            (state)=>state.five]
      }

      const works = {
        a : (one) => {
        //  console.log(6,one)
          expect(one).toBe(1);
        //    console.log(7,one)
          A();
          return one + one;
        },
        b : (one,five)=> {
          expect(one).toBe(1);
          expect(five).toBe(5);
          B();
          //  console.log("?",one,works.a)
          return works.a(one)+five;
        }
      }

      const connect = genSelectState( map_to_props, works );

      const state = { one:1, five:5 }

      expect(connect(state)).toEqual({ a:2, b:7 });

      expect(A.mock.calls.length).toBe(1);
      expect(B.mock.calls.length).toBe(1);
    })

//++++++++++++ should wrap calling worker object(Array) - obj
//++++++++++++++++++++++++++++++++++++++++++++++++++++

    it('should wrap calling worker object(Array) - obj', () => {

      const A = jest.fn();
      const B = jest.fn();

      const map_to_props = {
        a: [(state)=>state.one,
            (state)=>state.five],
        b: [(state)=>state.one,
            (state)=>state.five]
      }

      const works = {
        a : (one,five) => {
        //  console.log(6,one)
          expect(one).toBe(1);
          expect(five).toBe(5);
        //    console.log(7,one)
          A();
          return one + one;
        },
        b : (one,five)=> {
          expect(one).toBe(1);
          expect(five).toBe(5);
          B();
          //  console.log("?",one,works.a)
          return works.a(one,five)+five;
        }
      }

      const connect = genSelectState( map_to_props, works );

      const state = { one:1, five:5 }

      expect(connect(state)).toEqual({ a:2, b:7 });

      expect(A.mock.calls.length).toBe(1);
      expect(B.mock.calls.length).toBe(1);
    })

//+++++++++++++ should wrap calling worker object - fn
//++++++++++++++++++++++++++++++++++++++++++++++++++++

    it('should wrap calling worker object - fn', () => {

      const A = jest.fn();
      const B = jest.fn();

      const map_to_props = (state)=> ({
        a:  state.one,
        b: [state.one,state.five]
      })

      const works = {
        a : (one) => {
          expect(one).toBe(1);
          A();
          return one + one;
        },
        b : (one,five)=> {
          expect(one).toBe(1);
          expect(five).toBe(5);
          B();
          return works.a(one)+five;
        }
      }

      const connect = genSelectState( map_to_props, works );

      const state = { one:1, five:5 }

      expect(connect(state)).toEqual({ a:2, b:7 });

      expect(A.mock.calls.length).toBe(1);
      expect(B.mock.calls.length).toBe(1);
    })

//+++++++++++++ should wrap calling worker object - fn
//++++++++++++++++++++++++++++++++++++++++++++++++++++

    it('should wrap calling worker object(Array) - fn', () => {

      const A = jest.fn();
      const B = jest.fn();

      const map_to_props = (state)=> ({
        a: [state.one,state.five],
        b: [state.one,state.five]
      })

      const works = {
        a : (one,five) => {
        //  console.log(one,five)
          expect(one).toBe(1);
          expect(five).toBe(5);
          A();
        //  console.log("a")
          return one + one;
        },
        b : (one,five)=> {
          expect(one).toBe(1);
          expect(five).toBe(5);
          B();
      //    console.log("b")
          return works.a(one,five)+five;
        }
      }

      const connect = genSelectState( map_to_props, works );

      const state = { one:1, five:5 }

      expect(connect(state)).toEqual({ a:2, b:7 });

      expect(A.mock.calls.length).toBe(1);
      expect(B.mock.calls.length).toBe(1);
    })
})

//=====================================================
//======================================== shouldUpdate
//=====================================================

describe('shouldUpdate - reduce unneeded re-rendering', () => {

//++++++++++++++++++++++++++++++++++++++ should reduce
//++++++++++++++++++++++++++++++++++++++++++++++++++++

      it('should reduce', () => {
            expect(shouldUpdate({a:1},{a:2})).toBeTruthy()
      })

//++++++++++++++++++++++++++++++++++ should not reduce
//++++++++++++++++++++++++++++++++++++++++++++++++++++

      it('should not reduce', () => {
        const x = {a:1}
          expect(shouldUpdate(x,x)).toBeFalsy()
      })
})
