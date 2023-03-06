import { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './App.css'
import axios from 'axios';


const modules= {
    toolbar:[
      [{header:[1,2,3,4,5,6,false]}],
       [{font:[]}],
       [{size:[]}],
       ['bold', 'italic', 'underline','strike', 'blockquote'],
       [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}], 
      //  ["link","image","video"] 
    ]

}


function App() {
  const [count, setCount] = useState(0)

  const [value,setValue]=useState("")

  const options = {
    method: 'POST',
    url: 'http://localhost:4000/addDocToCollection',
    data: {value}
  };
  
  return (
    <div className="container">

      <div className="row">
        <div className="editor">
          
          {/* Main Editor */}
          <ReactQuill theme="snow" value={value}
          onChange={setValue}
          className="editorInput"
          modules={modules}
          />
        </div>
        <div className="preview">
          {value}
          <div className="submitButton">
        <button id='btnSubmit' onClick={()=>{
          setValue('');
          axios
          .request(options)
          .then(function (response) {
            
              console.log(response.data);
          })
          .catch(function (error) {
              console.error(error);
          });
          
        }}>SUBMIT</button>
      </div>
        </div>
      </div>


      
    </div>
  )
}

export default App
