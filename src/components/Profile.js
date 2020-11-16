import React , { Component } from 'react';
import { Icon,Card, Grid, Header, Button, Divider, List, Segment, Form, Message, Label, Dropdown} from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import CKEditor from 'ckeditor4-react';
import PropTypes from 'prop-types';

axios.defaults.xsrfCookieName = 'frontend_csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

class Profile extends Component
{
  constructor()
  {
    super();
    this.state = { 
      isLoggedIn : false,
      userId : "",
      username : "",
      first_name : "",
      last_name : "" ,
      email : "",
      about : "",
      workExperience : "",
      phone_number : "",
      isLoggedIn : false,
      data : [],
      redirect : false,
      failed : false,
      projects :[],
      companies : [],
      company : "",
      position : "",
      time : "",
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.companySubmit = this.companySubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  async componentDidMount()
  {
    const re = await axios({url:'http://127.0.0.1:8000/users/currentuser', method:'get' , withCredentials:true}).then(response=>{return response}).catch(error=>{window.location.href="http://127.0.0.1:3000/error"})
    console.log(re);
     const js = await re.data;
     this.setState({userId:js.userId});
     console.log(this.state.userId);
     if(this.state.userId==0) {
         window.location.href="http://127.0.0.1:3000/";
     }
     else {
       this.setState({isLoggedIn:true});
     }
     const response = await axios({url:`http://127.0.0.1:8000/users/${js.userId}`,method:'GET' , withCredentials:true}).then(response=>{return response}).catch(error=>{window.location.href="http://127.0.0.1:3000/error"})
     const json = await response.data;
     this.setState({data:json});
     console.log(json);
     this.setState({username:this.state.data.username})
     this.setState({first_name:this.state.data.first_name})
     this.setState({last_name:this.state.data.last_name})
     this.setState({email:this.state.data.email})
     this.setState({phone_number:this.state.data.phone_number})
     this.setState({workExperience:this.state.data.workExperience})
     this.setState({about:this.state.data.about})

     const projectdata = await axios({url:'http://127.0.0.1:8000/projects/userprojects' , method:'GET' , withCredentials:true}).then(response=>{return response}).catch(error=>{window.location="http://127.0.0.1:3000/error"})
     console.log(projectdata);
     const projectjson = await projectdata.data;
     this.setState({projects:projectjson})
	
     const companydata = await axios({url:'http://127.0.0.1:8000/companies/usercompanies' , method:'GET' , withCredentials:true}).then(response=>{return response}).catch(error=>{console.log(error)})
     console.log(companydata);
     const companyjson = await companydata.data;
     this.setState({companies:companyjson})

  }



  onEditorChange(evt){
    this.setState({
      about:evt.editor.getData()
    });
  }
  handleAboutChange = event => {
    this.setState({
      about: event.target.value
    })
  }
  handleFirstnameChange = event => {
    this.setState({
      first_name: event.target.value
    })
  }
  handleLastnameChange = event => {
    this.setState({
      last_name: event.target.value
    })
 }
  handlePhonenumberChange = event => {
    this.setState({
      phone_number: event.target.value
    })
  }

  handleWorkexperienceChange=(event , data) => {

    let  opt= data.value;
    this.setState({workExperience:opt});
  }

  handleSubmit = async(event) => {
    event.preventDefault()
    const projectId = this.state.userId;
    let formData = { username: this.state.username, first_name: this.state.first_name , last_name:this.state.last_name , email:this.state.email  , about:this.state.about , workExperience:this.state.workExperience , password : this.state.data.password }
    await axios({url:`http://127.0.0.1:8000/users/${this.state.userId}/` ,method:'PUT', data:formData , withCredentials:true} ).then(response=>{this.setState({redirect:true}); }).catch(error=>{this.setState({failed:true}); })
  }

  handleCompanyChange = event => {
    this.setState({
      company: event.target.value
    })
  }
  
  handlePositionChange = event => {
    this.setState({
      position: event.target.value
    })
  }

  handleTimeChange=(event , data) => {

    let  opt= data.value;
    this.setState({time:opt});
  }



   companySubmit = async(event) => {
    event.preventDefault();
    let formData = { user:this.state.userId ,company: this.state.company, position: this.state.position , time:this.state.time}
    const res = await axios({url:'http://127.0.0.1:8000/companies/' ,method:'POST', data:formData , withCredentials:true} ).then(response=>{return response}).catch(error=>{console.log(error)})
    const companydata = await axios({url:'http://127.0.0.1:8000/companies/usercompanies' , method:'GET' , withCredentials:true}).then(response=>{return response}).catch(error=>{console.log(error)})
     console.log(companydata);
     const companyjson = await companydata.data;
     this.setState({companies:companyjson})
     this.setState({company:""})
    this.setState({position:""})
    this.setState({time:""})

  }


  async handleDelete(data) {
  const companyId = data;
   console.log(companyId);
  const res = await axios({url:`http://127.0.0.1:8000/companies/${companyId}` ,method:'DELETE' , withCredentials:true} ).then(response=>{return response}).catch(error=>{console.log(error)})
  const companydata = await axios({url:'http://127.0.0.1:8000/companies/usercompanies' , method:'GET' , withCredentials:true}).then(response=>{return response}).catch(error=>{console.log(error)})
     console.log(companydata);
     const companyjson = await companydata.data.results;
     this.setState({companies:companyjson})

}

  renderRedirect= () => {
    if(this.state.redirect==true) {
      return <Redirect to={{pathname:'/done'  }}/>
    }
    else if(this.state.failed==true) {
      return <Redirect to={{pathname:'/error'  }}/>
    }
 }
  render()
  {    
    const workOptions = [
    {
      key: '0',
      text: '<1 year',
      value: '0',
    },
    {
      key: '1',
      text: '1-2 years',
      value: '1',
    },
    {
      key: '2',
      text: '2-5 years',
      value: '2',
    },
    {
      key: '3',
      text: '>5 years',
      value: '3',
    },
    ]
    return(
      <div>
        <Grid padded>
           <Grid.Row color='black'>
              <Grid.Column width={1}>
                <Icon name="world" size="big"/>
              </Grid.Column>
              <Grid.Column width={15}>
                <h2>ReFree</h2>
              </Grid.Column>
          </Grid.Row>
        </Grid>
        <br/>
        <br/>
        <div style={{margin:'auto' , paddingLeft:'10%' , paddingRight:'10%'}}>
          <Grid stackable columns={2} divided>
          <Grid.Row>
          <Grid.Column>
          <Header as='h2'>
            <Icon name='user' />
            <Header.Content>My Profile 
            <Header.Subheader>Edit your profile and save changes</Header.Subheader>
            </Header.Content>
         </Header>
        <br/>
        <Form onSubmit={event => this.handleSubmit(event)}>
          <Divider horizontal>
             <Header as='h4'>
                <Icon name='user circle' />
                Personal Details
              </Header>
          </Divider>

          <Form.Field >
            <label >Username</label>
            <input type="text" value={this.state.username}  readOnly/>
          </Form.Field>
          <div style={{display:'grid' , gridTemplateColumns:'auto auto'}}>
            <div style={{paddingRight:'2%'}}>
              <Form.Field >
                <label style={{fontWeight:'bold'}}>Firstname</label>
                <input type="text" value={this.state.first_name}  onChange={event => this.handleFirstnameChange(event)} />
              </Form.Field>
            </div>
            <div style={{ paddingLeft:'2%'}}>
              <Form.Field >
                <label>Lastname</label>
	        <input type="text" value={this.state.last_name}  onChange={event => this.handleLastnameChange(event)}/>
              </Form.Field>
	   </div>
          </div>
          <br />
          <br />
	
		 
          <Divider horizontal>
            <Header as='h4'>
              <Icon name='address book' />
              Contact Details
            </Header>
         </Divider>
         <div style={{display:'grid' , gridTemplateColumns:'auto auto' }}>
           <div style={{paddingRight:'2%'}}>
             <Form.Field >
                <label>Phone Number</label>
                <input type="text" value={this.state.phone_number} readOnly />
             </Form.Field>
           </div>
           <div style={{paddingLeft:'2%'}}>
             <Form.Field >
                <label>Email</label>
                <input type="email" value={this.state.email}  readOnly/>
             </Form.Field>
          </div>
          </div>
          <br/>
          <br/>

          <Divider horizontal>
            <Header as='h4'>
              <Icon name='suitcase' />
              Professional Details
            </Header>
          </Divider>

          <Form.Field >
            <label>About</label>
            <CKEditor data={this.state.about} type="inline"  onChange={this.onEditorChange}/>
            <textarea style={{display:'none'}} value={this.state.about}  readOnly onChange={this.handleAboutChange}/>
        </Form.Field>

        <Form.Field >
          <label>Work Experience</label>
          <Dropdown name="workExperience" value={this.state.workExperience}  fluid search selection options = {workOptions} onChange={(event,data) =>this.handleWorkexperienceChange(event , data)}/>
       </Form.Field>

       <div style={{padding:'5% 0px 0px 0px', textAlign:'center'}}>
       <Button color='green' type="submit" icon >Save Changes</Button></div>
     </Form>
	 <Divider horizontal>
            <Header as='h4'>
              <Icon name='industry' />
              Companies
            </Header>
          </Divider>

     <List divided relaxed size='large'>
       {this.state.companies.map(el => (
    <List.Item>
      <List.Icon name='suitcase' size='large' verticalAlign='middle' />
      <List.Content>
        <List.Header>{el.company}</List.Header>
        <List.Description as='a'>Postion {el.position} ,  
	<span style={{paddingLeft:'10px' , paddingRight:'10px'}}> <Dropdown name="display" value={el.time}   options = {workOptions} disabled/></span>
        <span style={{paddingLeft:'5px'}}> <Button onClick={()=>this.handleDelete(el.id)} icon color='red' size='tiny'><Icon name="trash" /></Button></span>
</List.Description>
      </List.Content>
    </List.Item>
   ))}
    </List>
    <Divider horizontal>
            <Header as='h4'>
              <Icon name='plus' />
              Add Company
            </Header>
          </Divider>

     <Form onSubmit={event => this.companySubmit(event)}>
        <Form.Field >
                <label style={{fontWeight:'bold'}}>Company Name</label>
                <input type="text" value={this.state.company}  onChange={event => this.handleCompanyChange(event)} />
        </Form.Field>
	<Form.Field >
                <label style={{fontWeight:'bold'}}>Positon</label>
                <input type="text" value={this.state.position}  onChange={event => this.handlePositionChange(event)} />
        </Form.Field>
	<Form.Field >
                <label style={{fontWeight:'bold'}}>Time</label>
                <Dropdown name="time" value={this.state.time}  fluid search selection options = {workOptions} onChange={(event,data) =>this.handleTimeChange(event , data)}/>
         </Form.Field>
	 <div style={{padding:'5% 0px 0px 0px', textAlign:'center'}}>
       <Button color='green' type="submit" icon >Add Company</Button></div>
       </Form>
     </Grid.Column>
     <Grid.Column> 
     <Header as='h2'>
       <Icon name='folder' />
       <Header.Content>My Projects
       <Header.Subheader>View list of projects and click to edit</Header.Subheader>
       </Header.Content>
     </Header>
     <br />
     <br />
     <Card.Group>
       {this.state.projects.map(el => (
       <Card href='http://127.0.0.1:3000/'>
         <Card.Content>  <Card.Header>{el.name}</Card.Header>
         <Card.Meta>Project Number {el.id}</Card.Meta>
         <Card.Description> {el.description} </Card.Description>
         </Card.Content>
       </Card>
       ))}
     </Card.Group>
     </Grid.Column>
     </Grid.Row>
     </Grid>
   </div>
   {this.renderRedirect()}
  </div>
  );
  }
}


class EditorPreview extends Component {
    render() {
        return (
            <div className="editor-preview">
                <br /><h4>Rendered content</h4>
                <div dangerouslySetInnerHTML={ { __html: this.props.data } }></div>
        	<br />
	</div>
        );
    }
}

EditorPreview.defaultProps = {
    data: ''
};

EditorPreview.propTypes = {
    data: PropTypes.string
};
export default Profile;
 
