export const initialState = null;

//initialState
/*
{
  "value": {
    "state": {
      "_id": "5f880c325bc14134c8c086c5",
      "name": "sheruuuu@c.com",
      "email": "sheruuuu@c.com",
      "following": [
        "5f857267afc5b61fe0c0a155"
      ],
      "followers": [],
      "photo": "http://res.cloudinary.com/dbyixrfgw/image/upload/v1602751512/okemkywetsyeaq9uukxr.png"
    },
    "dispatch": "ƒ bound dispatchAction() {}"
  },
  "children": "<BrowserRouter />"
}
*/

//logged in users state only
export const reducer = (state,action) => {
   if(action.type === "USER"){ //jwt
       return action.payload
   }

   if(action.type === "CLEAR"){
    return null;
    }

    if(action.type === "UPDATE"){
        return{
            ...state,
            following:action.payload.following,
            followers:action.payload.followers
        }
        };


        if(action.type === "UPDATEPIC"){
            return {
                ...state,
                photo:action.payload
            }
        }
        

   return state;
}