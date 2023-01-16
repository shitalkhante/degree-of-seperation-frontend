import React from "react";
import { ReactDialogBox } from 'react-js-dialog-box';
import 'react-js-dialog-box/dist/index.css';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import { getPeople } from './redux/reducer';
import { useEffect, useState } from 'react';
import { addPeople, getDegreeOfSeperation, getPeoples } from './httpService/httpService';
function App() {
  const [state, setState] = useState({ name: "", rel_type: "", ref: [] })
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [dialog,setDialog] = useState([]);
  const people = useSelector((state) => state.people.value);
  const dispatch = useDispatch()
  console.log(state);
  useEffect(() => {
    getPeoples().then(data => {
      dispatch(getPeople(data.data))
    })
    // console.log(state);
  }, [])

  async function add() {
    console.log(state);
    await addPeople(state).then(data => {
      alert(data.data.msg);
    }).catch(err => {
      console.log(err);
      alert("error in saving");
    });
    setState({ name: "", rel_type: "", ref: [] });
    document.location.reload();
  }

  function addElement(list, val, idx) {
    let child = document.createElement('label');
    let btn = document.createElement('button');
    btn.innerText = 'x';
    child.innerText = val.name;
    child.appendChild(btn);
    child.id = idx;
    document.getElementById(list).appendChild(child);
    return btn;
  }
  async function calDegreeOfSeperation() {
    await getDegreeOfSeperation({ src: selected[0], tar: selected[1] }).then(res => {
      console.log(res);
      if (res.data.data.length > 0) {
        setDialog(res.data.data);
        // res.data.data.map(r => {
        //   alert(r.join('->'))
        // })
      } else
      setDialog(['no relation'])
      // document.location.reload();
    }).catch(err => {
      alert('error');
      console.log(err);
    })
  }
  return (
    <div className="App">
      <h1 id="header">welcome Back</h1>
      <div className='insert'>
        <h2 className='sub_heading'>add people here...</h2>
        <div className='column'>
          <label>Name:</label>
          <input type={"text"} placeholder='enter your name' onInput={(e) => { setState({ ...state, name: e.target.value }) }} />
        </div>

        <h4>Add Relation:</h4>
        <div className='column'>
          <label>Type:</label>
          <select id='select' onChange={(e) => { setState({ ...state, rel_type: e.target.value }) }}>
            <option disabled selected>choose</option>
            <option>{"friend"}</option>
          </select>
        </div>
        
        <div className='column'>
          <label>add-people: </label>
          <span id='list_relative'></span>
       </div>
        <div className='find_friends'>
          <input type={'search'} placeholder='search people to add' value={search} onInput={(e) => {
            setSearch(e.target.value);
          }} />
          <div className='hidden_select' style={{ display: search.length ? 'block' : 'none'}}>
            {
              people.filter(row => { if (row.name.toLowerCase().includes(search)) return row }).map((val, idx) => {
                return (<p className='options' onClick={() => {
                  setState({ ...state, ref: [...state.ref, val._id] });
                  let btn = addElement('list_relative', val, idx);
                  setSearch("");
                  btn.addEventListener('click', () => {
                    document.getElementById('list_relative').removeChild(document.getElementById(idx))
                    setState({ ...state, ref: state.ref.filter(r => { if (r !== idx) return r }) })
                  });
                }}>{val.name}</p>)
              })}
          </div>
        </div>
        <button onClick={() => add()} className='btn'>Add</button>
      </div>
      <div className='show_rel'>
        <h1>Find Degree of Seperation here...</h1>
        <div className='take_input'>
          <label>Select any two people</label>
          <div id='selected_friend'></div>
          <button className='btn' onClick={() => { calDegreeOfSeperation() }}>Show Relation</button>
        </div>
        <div className='all_people'>
        {people.map((val, idx) => {
          return (<div style={{cursor:'pointer',border:'1px solid gray',padding:'5px'}} onClick={() => {
            if (selected.length === 2)
              alert("you can select only 2 persons");
            else {
              setSelected([...selected, val]);
              let btn = addElement('selected_friend', val, val._id);
              console.log(selected);
              btn.addEventListener('click', () => {
                console.log(selected);
                document.getElementById('selected_friend').removeChild(document.getElementById(val._id))
                setSelected([...selected.filter(r => { if (r._id !== val._id) return r })])
              });
            }
          }}>{val.name}</div>)
        })}
        </div>
      </div>
     {dialog.length>0 && <ReactDialogBox 
              headerBackgroundColor='green'
              headerTextColor='white'
              headerHeight='60px'
              closeButtonColor='white'
              bodyBackgroundColor='white'
              bodyTextColor='black'
              bodyHeight='200px'
              headerText='Degree of Seperation is ...'
              headerFontSize='25px'
              closeBox={()=>{setDialog([])}}>
                { dialog.length>1 &&
                dialog.map(r => {
          return(<p>{r.join('->')}</p>)
        })}
        {
          dialog.length===1 &&
          <p>{dialog}</p>
        }
            <button onClick={()=>{setDialog([])}}>close</button>
              </ReactDialogBox>}
    </div>
  );
}

export default App;
