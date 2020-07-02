import * as React from 'react';
import styles from './EnterDetails.module.scss';
import { IEnterDetailsProps } from './IEnterDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, ISPHttpClientOptions, SPHttpClientConfiguration  ,SPHttpClientResponse} from "@microsoft/sp-http";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as Moment from 'moment';  
import 'react-dates/initialize';  
import 'react-dates/lib/css/_datepicker.css';  
import DateTimeField from "react-bootstrap-datetimepicker";
import { GetParameterValues } from '../../projectGrid/Components/getQueryString';
import { Form, FormGroup, Button, FormControl } from "react-bootstrap";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { ISPList } from "../../projectGrid/ProjectGridWebPart";
import * as $ from "jquery";
import 'jqueryui';

require('./EnterDetails.module.scss');
SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.css");


export interface IreactState{
  RMS_Id: string,
  CRM_Id: string,
  BusinessGroup: string;
  ProjectName: string;
  ClientName: string;
  ProjectManager: string;
  ProjectType: string;
  ProjectRollOutStrategy: string;
  PlannedStart: string;
  PlannedCompletion: string;
  ProjectDescription: string;
  ProjectLocation: string;
  ProjectBudget: string;
  ProjectStatus: string;
  //peoplepicker
  DeliveryManager: string;
  //date
  startDate: any;  
  endDate: any;  
  focusedInput: any;
  FormDigestValue: string;
}
var timerID;
var newitem: boolean;
export default class EnterDetails extends React.Component<IEnterDetailsProps, IreactState> {
  constructor(props: IEnterDetailsProps, state: IreactState) {  
    super(props);  
  
    this.state = {  
      //status: 'Ready',  
      //items: []
      RMS_Id : '',
      CRM_Id :'',
      BusinessGroup: '',
      ProjectName: '',
      ClientName: '',
      ProjectManager: '',
      ProjectType: '',
      ProjectRollOutStrategy: '',
      PlannedStart: '',
      PlannedCompletion: '',
      ProjectDescription: '',
      ProjectLocation: '',
      ProjectBudget: '',
      ProjectStatus: '',
      DeliveryManager:'',
      startDate: '',
      endDate: '',
      focusedInput: '',
      FormDigestValue:''
    };  
    this.saveItem=this.saveItem.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this._getProjectManager =this._getProjectManager.bind(this);
    //this.loadItems = this.loadItems.bind(this);
    //this.isOutsideRange = this.isOutsideRange.bind(this);
  }
  public componentDidMount() {
    //$('.pickerText_4fe0caaf').css('border','0px');
    $('#selected-items-id__38').next('input').addClass('form-control');
    $('#selected-items-id__36').next('input').addClass('form-control');
    //$('.datepicker').datepicker();
    $("#inpt_plannedStart").datepicker({
      dateFormat: "dd-M-yy",
      minDate: 0,
      onSelect: function (date) {
          var date2 = $('#inpt_plannedStart').datepicker('getDate');
          date2.setDate(date2.getDate() + 1);
          $('#inpt_plannedCompletion').datepicker('setDate', date2);
          //sets minDate to dt1 date + 1
          $('#inpt_plannedCompletion').datepicker('option', 'minDate', date2);
      }
      });
    $('#inpt_plannedCompletion').datepicker({
          dateFormat: "dd-M-yy",
          onClose: function () {
              var dt1 = $('#inpt_plannedStart').datepicker('getDate');
              var dt2 = $('#inpt_plannedCompletion').datepicker('getDate');
              //check to prevent a user from entering a date below date of dt1
              if (dt2 <= dt1) {
                  var minDate = $('#inpt_plannedCompletion').datepicker('option', 'minDate');
                  $('#inpt_plannedCompletion').datepicker('setDate', minDate);
              }
          }
      });
    //datepicker
    if((/edit/.test(window.location.href))){
      newitem = false;
      this.loadItems();
    }
    if((/new/.test(window.location.href))){
      newitem = true
    }
    this.getAccessToken();
    timerID=setInterval(
      () =>this.getAccessToken(),300000); 
 }
 public componentWillUnmount()
 {
  clearInterval(timerID);
  
 } 
 //public  isOutsideRange = day =>day.isAfter(Moment()) || day.isBefore(Moment().subtract(0, "days"));  
  private handleChange = (e) => {

    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }
  private handleSubmit = (e) =>{
    if(newitem){
      this.createItem(e);
    }else{
      this.saveItem(e);
    }
  }
  private _getProjectManager = (items: any[]) => {  
    console.log('Items:', items);  
    this.setState({ ProjectManager: items[0].text });
  }
  private _getDeliveryManager = (items: any[]) => {  
    console.log('Items:', items);  
    this.setState({ DeliveryManager: items[0].text });
  }

  public render(): React.ReactElement<IEnterDetailsProps> {
    SPComponentLoader.loadCss("//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css");
    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.7.14/js/bootstrap-datetimepicker.min.js");
    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.1/css/bootstrap-datepicker3.css");
    return (
      <div id="newItemDiv" >
      <Form onSubmit={this.handleSubmit}>
        <Form.Row className="mt-3">
          <FormGroup className="col-2">
            <Form.Label className={styles.customlabel}>RMS ID</Form.Label>
          </FormGroup>
          <FormGroup className="col-3">
            <Form.Control type="text" id="_RMSID" name="RMS_Id" placeholder="RMS ID" onChange={this.handleChange} value={this.state.RMS_Id}/>
          </FormGroup>
          <FormGroup className="col-1"></FormGroup>
          <FormGroup className="col-2">
            <Form.Label className={styles.customlabel}>CRM ID</Form.Label>
          </FormGroup>
          <FormGroup className="col-3">
            <Form.Control type="text" id="_CRMID" name="CRM_Id" placeholder="CRM ID" onChange={this.handleChange} value={this.state.CRM_Id}/>
          </FormGroup>
        </Form.Row>

        <Form.Row>
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel}>Business Group</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control id="_businessGroup" as="select" name="BusinessGroup" onChange={this.handleChange} value={this.state.BusinessGroup}>
                <option value="">Select an Option</option>
                <option value="Group 1">Group 1</option>
                <option value="Group 2">Group 2</option>
                <option value="Group 3">Group 3</option>
              </Form.Control>
            </FormGroup>

            <FormGroup className="col-1"></FormGroup>

            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel}>Project Name</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control type="text" id="_projectName" name="ProjectName" placeholder="Ex: John Deer" onChange={this.handleChange} value={this.state.ProjectName} />
            </FormGroup>
          </Form.Row>

          <Form.Row>
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel}>Delivery Manager</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <PeoplePicker 
              context={this.props.currentContext}
              personSelectionLimit={1}    
              groupName={""} // Leave this blank in case you want to filter from all users    
              showtooltip={true}    
              isRequired={true}    
              disabled={false}    
              ensureUser={true}  
              selectedItems={this._getDeliveryManager}   
              defaultSelectedUsers={[this.state.DeliveryManager]} 
              showHiddenInUI={false}    
              principalTypes={[PrincipalType.User]}    
              resolveDelay={1000} />  
            </FormGroup>

            <FormGroup className="col-1"></FormGroup>

            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel}>Project Manager</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <PeoplePicker 
              context={this.props.currentContext}   
              personSelectionLimit={1}    
              groupName={""} // Leave this blank in case you want to filter from all users    
              showtooltip={true}    
              isRequired={true}    
              disabled={false}    
              ensureUser={true}    
              selectedItems={this._getProjectManager} 
              defaultSelectedUsers={[this.state.ProjectManager]}   
              showHiddenInUI={false}    
              principalTypes={[PrincipalType.User]}    
              resolveDelay={1000} />  
            </FormGroup>
           </Form.Row>

          <Form.Row>
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel}>Client Name</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control type="text" id="_clientName" name="ClientName" placeholder="Client Name" onChange={this.handleChange} value={this.state.ClientName}/>
            </FormGroup>
            <FormGroup className="col-1"></FormGroup>
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel}>Project Type</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control id="_projectType" as="select" name="ProjectType" onChange={this.handleChange} value={this.state.ProjectType}>
                <option value="">Select an Option</option>
                <option value="SAPS4-Conversion">SAPS4-Conversion  All S/4 HANA Conversions[Migrations]</option>
                <option value="SAPS4-Con_Upg">SAPS4-Con_Upg  All S/4 HANA Conversions & Upgrades together</option>
                <option value="SAPS4-Implementation">SAPS4-Implementation  All S/4 HANA Implementations</option>
                <option value="SAPSOH-Mig_Upg">SAPSOH-Mig_Upg  Suite on HANA Migrations & Upgrades</option>
                <option value="SAPSOH-Functional">SAPSOH-Functional   All other Suite on HANA Functional projects</option>
                <option value="SAPBS-Implementation">SAPBS-Implementation  Business Suite Implementations. This Business Suite includes SAP products ERP/SCM/CRM/PLM/SRM</option>
                <option value="SAPBS-Upgrade">SAPBS-Upgrade  Business Suite Upgrades. This Business Suite includes SAP products ERP/SCM/CRM/PLM/SRM</option>
                <option value="SAPECC-Rollout">SAPECC-Rollout  ECC Template Rollouts</option>
                <option value="SAP-Module-Based">SAP-Module-Based  Module Based projects like EWM</option>
                <option value="SAP-Technical">SAP-Technical  Unicode conversions, Solman related projects or ABAP related projects</option>
                <option value="SAP- SuccessFactors">SAP- SuccessFactors  SAP SuccessFactors projects</option>
                <option value="SAP-Other">SAP-Other  All other projects for SAP</option>
                <option value="Con Adv">Con Adv - Consulting Advisory…can be process work, business strategy etc</option>
                <option value="PMO Serv">PMO Serv – PMO Services</option>
                <option value="Train Serv">Train Serv – Training Services</option>
                <option value="Test Serv">Test Serv – Testing Services</option>
              </Form.Control>
            </FormGroup>
          </Form.Row>
        <Form.Row>
          <FormGroup className="col-2">
            <Form.Label className={styles.customlabel}>Project Strategy</Form.Label>
          </FormGroup>
          <FormGroup className="col-3">
              <Form.Control id="_projectRollOut" as="select" name="ProjectRollOutStrategy" onChange={this.handleChange} value={this.state.ProjectRollOutStrategy}>
              <option value="">Select an Option</option>
              <option value="Phased">Phased</option>
              <option value="Big Bang">Big Bang</option>
              <option value="Roll Out">Roll Out</option>
              <option value="Expansion">Expansion</option>
              <option value="other">other</option>
              </Form.Control>
            </FormGroup>
          <FormGroup className="col-1"></FormGroup>
          <FormGroup className="col-2">
            <Form.Label className={styles.customlabel}>Project Status</Form.Label>
          </FormGroup>
          <FormGroup className="col-3">
            <Form.Control id="_projectStatus" as="select" name="ProjectStatus"  onChange={this.handleChange} value={this.state.ProjectStatus}>
              <option value="">Select an Option</option>
              <option value="In progress">In progress</option>
              <option value="Initiated">Initiated</option>
              <option value="Closed">Closed</option>
              <option value="Withdrawn">Withdrawn</option>
            </Form.Control>
          </FormGroup>
        </Form.Row>
        <Form.Row>
          <FormGroup className="col-2"> 
            <Form.Label className={styles.customlabel}>Planned Start</Form.Label>
          </FormGroup>
          <FormGroup className="col-3">
            <Form.Control className="md-form md-outline input-with-post-icon datepicker" type="text" id="inpt_plannedStart" name="PlannedStart" placeholder="Planned Start Date" onChange={this.handleChange} value={this.state.PlannedStart}/>
            
          </FormGroup>
          <FormGroup className="col-1"></FormGroup>
          <FormGroup className="col-2"> 
            <Form.Label className={styles.customlabel}>Planned Completion</Form.Label>
          </FormGroup>
          <FormGroup className="col-3">
            <Form.Control className="md-form md-outline input-with-post-icon datepicker" type="text" id="inpt_plannedCompletion" name="PlannedCompletion" placeholder="Planned Completion Date" onChange={this.handleChange} value={this.state.PlannedCompletion}/>
          </FormGroup>
        </Form.Row>
        {/* Project Description */}
        <Form.Row>
          <FormGroup className="col-2"> 
            <Form.Label className={styles.customlabel}>Project Description</Form.Label>
          </FormGroup>
          <FormGroup className="col-8 mb-3">
            <Form.Control as="textarea" rows={4} type="text" id="_projectDescription" name="ProjectDescription" placeholder="Project Description" onChange={this.handleChange} value={this.state.ProjectDescription}/>
          </FormGroup>
        </Form.Row>
        {/* Next Row */}
        <Form.Row className="mb-4">
          <FormGroup className="col-2"> 
            <Form.Label className={styles.customlabel}>Project Location</Form.Label>
          </FormGroup>
          <FormGroup className="col-3">
            <Form.Control type="text" id="_location" name="ProjectLocation" placeholder="Project Location" onChange={this.handleChange} value={this.state.ProjectLocation}/>
          </FormGroup>
          <FormGroup className="col-2"> 
            <Form.Label className={styles.customlabel}>Project Budget</Form.Label>
          </FormGroup>
          <FormGroup className="col-3">
            <Form.Control type="text" id="_budget" name="ProjectBudget" placeholder="Project Budget" onChange={this.handleChange} value={this.state.ProjectBudget}/>
          </FormGroup>
        </Form.Row>
        <Form.Row className={styles.buttonCLass}>
          <FormGroup className="col-4"></FormGroup>
          <Button id="submit" variant="primary" type="submit">
            Submit
          </Button> 
          <FormGroup className="col-1"></FormGroup>
          <Button id="cancle" variant="primary" onClick={this.closeform}>
            Cancle
          </Button>
        </Form.Row>
      </Form> 
  </div>
    );
  }
  private saveItem(e){
    var itemId = GetParameterValues('id');
    e.preventDefault();

    let requestData = {
      __metadata:  
      {  
          type: "SP.Data.Project_x0020_DetailsListItem"  
      },  
      ProjectID_RMS : this.state.RMS_Id,
      ProjectID_SalesCRM :this.state.CRM_Id,
      BusinessGroup: this.state.BusinessGroup,
      ProjectName: this.state.ProjectName,
      ClientName: this.state.ClientName,
      DeliveryManager: this.state.DeliveryManager,
      ProjectManager: this.state.ProjectManager,
      ProjectType: this.state.ProjectType,
      ProjectRollOutStrategy: this.state.ProjectRollOutStrategy,
      PlannedStart: this.state.PlannedStart,
      PlannedCompletion: this.state.PlannedCompletion,
      ProjectDescription: this.state.ProjectDescription,
      ProjectLocation: this.state.ProjectLocation,
      ProjectBudget: this.state.ProjectBudget,
      ProjectStatus: this.state.ProjectStatus
  
    };
    //validation
    if (requestData.ProjectID_RMS.length < 1 || requestData.ProjectID_SalesCRM.length < 1 || requestData.ProjectName.length < 1 || requestData.ProjectManager.length < 1) {
      $('input[name="RMS_Id"]').css('border','2px solid red');
      $('#selected-items-id__38').next('input').css('border','2px solid red');
      $('#selected-items-id__36').next('input').css('border','2px solid red');
      return false;
    }
  
    jQuery.ajax({
      url:this.props.currentContext.pageContext.web.absoluteUrl+ "/_api/web/lists/getByTitle('Project Details')/items("+ itemId +")",  
        type: "POST",  
        data: JSON.stringify(requestData),  
        headers:  
        {  
            "Accept": "application/json;odata=verbose",  
            "Content-Type": "application/json;odata=verbose",  
            "X-RequestDigest": this.state.FormDigestValue,
            "IF-MATCH": "*",
            'X-HTTP-Method': 'MERGE' 
        },  
        success:(data, status, xhr) => 
        {  
          alert("Submitted successfully");
          let winURL = 'https://ytpl.sharepoint.com/sites/yashpmo/SitePages/Projects.aspx';
          window.open(winURL,'_self');
        },  
        error: (xhr, status, error)=>
        {  
          alert(JSON.stringify(xhr.responseText));
          let winURL = 'https://ytpl.sharepoint.com/sites/yashpmo/SitePages/Projects.aspx';
          window.open(winURL,'_self');
        }  
    });
    
    this.setState({
      RMS_Id : '',
      CRM_Id :'',
      BusinessGroup: '',
      ProjectName: '',
      ClientName: '',
      DeliveryManager:'',
      ProjectManager: '',
      ProjectType: '',
      ProjectRollOutStrategy: '',
      PlannedStart: '',
      PlannedCompletion: '',
      ProjectDescription: '',
      ProjectLocation: '',
      ProjectBudget: '',
      ProjectStatus: '',
      startDate: '',
      endDate: '',
      focusedInput: '',
      FormDigestValue:''
    });
  }
  private getAccessToken(){
   
     jQuery.ajax({  
         url: this.props.currentContext.pageContext.web.absoluteUrl+"/_api/contextinfo",  
         type: "POST",  
         headers:{'Accept': 'application/json; odata=verbose;', "Content-Type": "application/json;odata=verbose",  
        },  
         success: (resultData)=> {  
           
           this.setState({  
             FormDigestValue: resultData.d.GetContextWebInformation.FormDigestValue
           });  
         },  
         error : (jqXHR, textStatus, errorThrown) =>{  
         }  
     });  
 }

 private loadItems(){

  var itemId = GetParameterValues('id');
  const url = this.props.currentContext.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Project Details')/items(`+ itemId +`)`;
  return this.props.currentContext.spHttpClient.get(url,SPHttpClient.configurations.v1,  
      {  
          headers: {  
            'Accept': 'application/json;odata=nometadata',  
            'odata-version': ''  
          }  
      }).then((response: SPHttpClientResponse): Promise<ISPList> => {  
          return response.json();  
        })  
      .then((item: ISPList): void => {   
        this.setState({
          RMS_Id: item.ProjectID_RMS,
          CRM_Id: item.ProjectID_SalesCRM,
          BusinessGroup: item.BusinessGroup,
          DeliveryManager: item.DeliveryManager,
          ProjectName: item.ProjectName,
          ClientName: item.ClientName,
          ProjectManager: item.ProjectManager,
          ProjectType: item.ProjectType,
          ProjectRollOutStrategy: item.ProjectRollOutStrategy,
          PlannedStart: item.PlannedStart,
          PlannedCompletion: item.PlannedCompletion,
          ProjectDescription: item.ProjectDescription,
          ProjectLocation: item.ProjectLocation,
          ProjectBudget: item.ProjectBudget,
          ProjectStatus: item.ProjectStatus
        })  
        console.log(this.state.ProjectManager) ;
      });
 }
 private createItem(e){
  
  e.preventDefault();

  let requestData = {
      __metadata:  
      {  
          type: "SP.Data.Project_x0020_DetailsListItem"  
      },  
      ProjectID_RMS : this.state.RMS_Id,
      ProjectID_SalesCRM :this.state.CRM_Id,
      BusinessGroup: this.state.BusinessGroup,
      ProjectName: this.state.ProjectName,
      ClientName: this.state.ClientName,
      DeliveryManager: this.state.DeliveryManager,
      ProjectManager: this.state.ProjectManager,
      ProjectType: this.state.ProjectType,
      ProjectRollOutStrategy: this.state.ProjectRollOutStrategy,
      PlannedStart: this.state.PlannedStart,
      PlannedCompletion: this.state.PlannedCompletion,
      ProjectDescription: this.state.ProjectDescription,
      ProjectLocation: this.state.ProjectLocation,
      ProjectBudget: this.state.ProjectBudget,
      ProjectStatus: this.state.ProjectStatus
    };
    console.log(requestData);
    if (requestData.ProjectID_RMS.length < 1 || requestData.ProjectID_SalesCRM.length < 1 || requestData.ProjectName.length < 1 || requestData.ProjectManager.length < 1) {
      $('input[name="RMS_Id"]').css('border','2px solid red');
      $('#selected-items-id__38').next('input').css('border','2px solid red');
      $('#selected-items-id__36').next('input').css('border','2px solid red');
      return false;
    }
  
    jQuery.ajax({
      url:this.props.currentContext.pageContext.web.absoluteUrl+ "/_api/web/lists/getByTitle('Project Details')/items",  
        type: "POST",  
        data: JSON.stringify(requestData),  
        headers:  
        {  
            "Accept": "application/json;odata=verbose",  
            "Content-Type": "application/json;odata=verbose",  
            "X-RequestDigest": this.state.FormDigestValue,
            "IF-MATCH": "*",
            'X-HTTP-Method': 'POST' 
        },  
        success:(data, status, xhr) => 
        {  
          alert("Submitted successfully");
          let winURL = 'https://ytpl.sharepoint.com/sites/yashpmo/SitePages/Projects.aspx';
          window.open(winURL,'_self');
        },  
        error: (xhr, status, error)=>
        {  
          alert(JSON.stringify(xhr.responseText));
          let winURL = 'https://ytpl.sharepoint.com/sites/yashpmo/SitePages/Projects.aspx';
          window.open(winURL,'_self');
        }  
    });
    
    this.setState({
      RMS_Id : '',
      CRM_Id :'',
      BusinessGroup: '',
      ProjectName: '',
      ClientName: '',
      DeliveryManager:'',
      ProjectManager: '',
      ProjectType: '',
      ProjectRollOutStrategy: '',
      PlannedStart: '',
      PlannedCompletion: '',
      ProjectDescription: '',
      ProjectLocation: '',
      ProjectBudget: '',
      ProjectStatus: '',
      startDate: '',
      endDate: '',
      focusedInput: '',
      FormDigestValue:''
    });

 }
 private closeform(){
  let winURL = 'https://ytpl.sharepoint.com/sites/yashpmo/SitePages/Projects.aspx';
  window.open(winURL,'_self');
  this.setState({
    RMS_Id : '',
    CRM_Id :'',
    BusinessGroup: '',
    ProjectName: '',
    ClientName: '',
    DeliveryManager:'',
    ProjectManager: '',
    ProjectType: '',
    ProjectRollOutStrategy: '',
    PlannedStart: '',
    PlannedCompletion: '',
    ProjectDescription: '',
    ProjectLocation: '',
    ProjectBudget: '',
    ProjectStatus: '',
    startDate: '',
    endDate: '',
    focusedInput: '',
    FormDigestValue:''
  });
 }
}
