import * as React from "react"
import {Button,Image,View,Platform} from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"

export default class image_pick extends React.Component{
  state={
    image:null,
  }
    render(){
      let {image}=this.state
      return(
        <View style={{flex:1,alingItems:"center"}}>
          <Button 
            title="Pick an Image from camera roll."
            onPress={this.pickimage}
            />
        </View>
      )
    }
    componentDidMount(){
      this.getPermission()
    }
    getPermission=async()=>{
      if(Platform.OS!=="web"){
        const {status}=await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if(status!=="granted"){
          alert("Sorry.We need camera roll permission to make this work.")
        }
      }
    }
    pickimage=async()=>{
      try{
        let result=await ImagePicker.launchImageLibraryAsync({
          mediaTypes:ImagePicker.MediaTypeOptions.All,
          allowsEditing:true,
          aspect:[4,3],
          quality:1
        })
      if(!result.cancelled){
        this.setState({
          image:result.data
        })
        console.log(result.uri)
        this.uploadImage(result.uri)
      }
      }
      catch(E){
        console.log(E)
      }
    }
    uploadImage=async(uri)=>{
      const data=new FormData()
      let filename=uri.split("/")[uri.split("/").length-1]
      let type=`image/${uri.split(".")[uri.split(".").lenght-1]}`
      const filetoupload={
        uri:uri,
        name:filename,
        type:type
      }
      data.append("digit",filetoupload)
      fetch("",{
        method:"POST",
        body:data,
        headers:{
          "content-type":"multipart/form-data"
        }
      })
      .then((response)=>response.json())
      .then((result)=>{console.log("Successfull",result)})
      .catch((error)=>{
        console.error("ERROR:",error)
      })
    }
}