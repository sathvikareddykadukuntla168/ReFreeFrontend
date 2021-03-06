import React , { Component } from 'react';
import { Icon,Card, Grid,Image, Header, Button,List, Divider, Segment, Form, Message, Label, Dropdown} from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import Toolbar from './Toolbar/Toolbar';
import SideDrawer from './SideDrawer/SideDrawer';
import axios from 'axios';
import CKEditor from 'ckeditor4-react';
import PropTypes from 'prop-types';

axios.defaults.xsrfCookieName = 'frontend_csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

class Personalizedfeed extends Component
{
  constructor()
  {
    super();
    this.state = {
	following : [],
        userId : "",
	projects : [],
	isLoggedIn:false,
     }
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
	  const followingdata = await axios({url:'http://127.0.0.1:8000/follow/userfollows' , method:'GET' , params:{userId:this.state.userId} ,withCredentials:true}).then(response=>{return response}).catch(error=>{console.log(error)})
     console.log(followingdata);
     const followingjson = await followingdata.data;
     this.setState({following:followingjson})
     let newarr = [];
     for(let user in this.state.following)
     {
	     console.log(this.state.following[user].following_user_id)
             const projectdata = await axios({url:'http://127.0.0.1:8000/projects/projectsuser' , method:'GET' , params:{userId:this.state.following[user].following_user_id} ,withCredentials:true}).then(response=>{return response}).catch(error=>{console.log(error)})
     console.log(projectdata);
     const projectjson = await projectdata.data;
	     console.log(projectjson)
	     for(let project in projectjson)
	     {
		     newarr.push(projectjson[project])
	     }
	     console.log(newarr)
      }
	  console.log(newarr);
      this.setState({projects:newarr})
  }
  drawerToggleClickHandler = () => {
    this.setState((prevState)=>{
      return {SideDrawerOpen: !prevState.SideDrawerOpen};
    });   
  
  };
   renderproject = project => {
        return (
            <div className = "indproject">
              <Link to = {{pathname : "/Projectpage",project : project.id}}>
          <Card 
        image={project.display}
        header={<CKEditor data={project.name} type = 'inline' readOnly={true} />}
        description={<CKEditor data={project.description} type="inline"  readOnly={true} />}
        extra={
          <div>
          <a>
            <Link to = {{pathname : "/individualuser" , state:{lookingAt:project.user} }}>
               <i class="users icon"></i>
               {this.state.userlist[project.user]}
               </Link>
               </a>
               <p></p>
      
          <i class="like icon"></i>
          {this.state.likeslist[project.id]}
               <p></p>
          {(new Date(project.creation).getDate() + "-"+ parseInt(new Date(project.creation).getMonth()+1) +"-"+new Date(project.creation).getFullYear())}
          </div>
        }
        />
        </Link>
        </div>
      
      
      
      )
      }
  
  render()
  {
    let sideDrawer;
    if(this.state.SideDrawerOpen){
      sideDrawer = <SideDrawer />;
    }
	  return(<div>
      <Toolbar drawerClickHandler={this.drawerToggleClickHandler} />
        {sideDrawer }
		  <Header as='h2'>
       <Icon name='folder' />
       <Header.Content>Personalized Projects
       <Header.Subheader>View list of personalized projects</Header.Subheader>
       </Header.Content>
     </Header>
     <br />
     <br />
	<Card.Group> 
       {this.state.projects.map(el => (
	       <div style={{padding:'2%'}}>
       <Link to = {{pathname : "/Projectpage",project : el.id}}>
	    <Card>
	       <Card.Content>{/*<Image floated='right' size='mini' src= {el.project} />*/}<Card.Header>{el.name}</Card.Header>
         <Card.Meta>Project Number {el.id}</Card.Meta>
         <Card.Description> <CKEditor data={el.description} type="inline" readOnly={true} />
 </Card.Description>
         </Card.Content>
       </Card>
	    </Link>
	       </div>
       ))}
	</Card.Group>
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


export default Personalizedfeed;

