import axios from "axios";




const api=axios.create({
  baseURL: "http://localhost:5000/api/"
})


api.interceptors.request.use(
  (config)=>{
  const accessToken=localStorage.getItem("accessToken");
  if(accessToken) {
    config.headers.authorization=`Bearer ${accessToken}`;
  }
  return config;
},
(error)=>{
  return Promise.reject(error);
}
)


api.interceptors.response.use(
  (response)=>response,
 (error)=>{
   if(error.response?.status===401) {
     localStorage.removeItem("accessToken");
     localStorage.removeItem("user");
     
   }
   return Promise.reject(error);
 }
)
export default api;