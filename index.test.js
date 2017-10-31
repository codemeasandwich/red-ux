
import { shouldUpdate, genSelectState } from './index'

describe('genSelectState - result caching', () => {

//+ should ...
//++++++++++++++++++++++++++++++++++++++++++++++++++++

    it('should cache results - map_to_props', () => {

      const mockCallback = jest.fn();
      mockCallback.mockReturnValue(123)

      const map_to_props = (state)=>({
        user  : state.user,
        posts : state.posts
      })

      const works = {
        posts : mockCallback
      }

      const connect = genSelectState( map_to_props, works );

      const state = {
        user:{name:"Bri"},
        posts:[{uid:123,userName:"Tom"}]
      }

      // call 1
      expect(connect(state).posts).toBe(123);

      // call 2
      expect(connect(state).posts).toBe(123);

      expect(mockCallback.mock.calls.length).toBe(1);
    })

    it('should cache results(muilt-value) - map_to_props', () => {

      const mockCallback = jest.fn();
      mockCallback.mockReturnValue(123)

      const map_to_props = (state)=>({
        user  : state.user,
        posts : [state.foo,state.bar]
      })

      const works = {
        posts : (a,b)=>mockCallback()
      }

      const connect = genSelectState( map_to_props, works );

      const state = {
        user:{name:"Bri"},
        posts:[{uid:123,userName:"Tom"}]
      }

      // call 1
      expect(connect(state).posts).toBe(123);

      // call 2
      expect(connect(state).posts).toBe(123);

      expect(mockCallback.mock.calls.length).toBe(1);
    })

    it('should return map_to_props if no workers', () => {

      const map_to_props = (state)=>({
        user  : state.user,
        posts : state.posts
      })

      const connect = genSelectState( map_to_props );

      const state = {
        user:{name:"Bri"},
        posts:[{uid:123,userName:"Tom"}]
      }

      expect(connect(state).posts).toEqual([{uid:123,userName:"Tom"}]);

    })

    it('should cache results - reselect', () => {

      const mockCallback = jest.fn();
      mockCallback.mockReturnValue(123)

      const selecters = {
        user  : state => state.user,
        posts : state => state.posts
      }

      const works = {
        posts : mockCallback
      }

      const connect = genSelectState( selecters, works );

      const state = {
        user:{name:"Bri"},
        posts:[{uid:123,userName:"Tom"}]
      }

      // call 1
      expect(connect(state).posts).toBe(123);

      // call 2
      expect(connect(state).posts).toBe(123);

      expect(mockCallback.mock.calls.length).toBe(1);
    })

    it('should cache results(muilt-value) - reselect', () => {
      const mockCallback = jest.fn();
      mockCallback.mockReturnValue(123)

      const selecters = {
        user  : state => state.user,
        posts : [state => state.foo,state => state.bar]
      }

      const works = {
        posts : (a,b)=>mockCallback()
      }

      const connect = genSelectState( selecters, works );

      const state = {
        user:{name:"Bri"},
        posts:[{uid:123,userName:"Tom"}]
      }

      // call 1
      expect(connect(state).posts).toBe(123);

      // call 2
      expect(connect(state).posts).toBe(123);

      expect(mockCallback.mock.calls.length).toBe(1);
    })
})


describe('shouldUpdate - reduce unneeded re-rendering', () => {

      it('should reduce', () => {
            expect(shouldUpdate({a:1},{a:2})).toBeTruthy()
      })

      it('should not reduce', () => {
        const x = {a:1}
          expect(shouldUpdate(x,x)).toBeFalsy()
      })
})
