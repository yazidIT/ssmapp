using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Net;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml;

namespace eSearchBaruTesting.VisualWebPart1
{
    public partial class VisualWebPart1UserControl : UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void btnCari_eSearch(object sender, EventArgs e)
        {
            try
            {

                string strEntityType = idDropRegistrationType.Text;
                string regNo = txtCarieSearch.Text;
                var newFormatNo = "";
                var username = "SSMPORTAL1";
                var password = "77522472";
                var url = "integrasi.ssm.com.my";

                if (strEntityType == "roc" || strEntityType == "rob")
                {
                    var regNoFormatType = "OLD";
                    var regNoType = "";
                    if (strEntityType == "roc")
                    {
                        regNoType = "ROC";
                    }
                    else
                    {
                        regNoType = "ROB";
                    }

                    newFormatNo = getNewOldFomratCompanyNo(regNo, regNoType, regNoFormatType, username, password, url);
                }
                if (strEntityType == "rocNew" || strEntityType == "robNew")
                {
                    var regNoFormatType = "NEW";
                    var regNoType = "";
                    if (strEntityType == "rocNew")
                    {
                        regNoType = "ROC";
                    }
                    else
                    {
                        regNoType = "ROB";
                    }

                    regNo = getNewOldFomratCompanyNo(regNo, regNoType, regNoFormatType, username, password, url);
                    if (regNo != "")
                    {
                        int regNolength = regNo.Length;
                        regNo = regNo.Substring(0, regNolength - 2);
                    }
                    newFormatNo = txtCarieSearch.Text;
                }

                // Create a request using a URL that can receive a post. WebRequest = using System.Net;
                WebRequest request = WebRequest.Create("http://integrasi.ssm.com.my/SSMPORTAL1/eSearch");
               
                request.Timeout = 5 * 1000;// in millisecond
                                           // Set the Method property of the request to POST.
                request.Method = "POST";
                // Create POST data and convert it to a byte array.
                // xml format : <?xml version=\"1.0\" encoding=\"UTF - 8\"?> 
                //eSearch

                String method = String.Empty;
                String entityParam = String.Empty;
                String dropType = idDropRegistrationType.SelectedItem.Value;
                if (dropType == "roc" || dropType == "rocNew")
                {
                    method = "findRoc";
                    entityParam = "companyNo";
                }
                else if (dropType == "rob" || dropType == "robNew")
                {
                    method = "findRob";
                    entityParam = "bizRegNo";
                }
                else if (dropType == "llp")
                {
                    method = "findLlp";
                    entityParam = "llpNo";
                }

                //String roc = "findRoc";
                //String com = "companyNo";
                //String entiti = "393099";
                string postData = "<Envelope xmlns=\"http://www.w3.org/2003/05/soap-envelope\">" +
                        "<Header/>" +
                        "<Body>" +
                        "<" + method + " xmlns=\"http://ws.wso2.org/dataservice\">" +
                        "<" + entityParam + ">" + regNo + "</" + entityParam + ">" +
                        "</" + method + ">" +
                        "</Body>" +
                        "</Envelope>";
                //viewXmleSearch.Text = postData;

                Console.WriteLine("post data ::: " + postData);
                //Encoding = using System.Text;
                byte[] byteArray = Encoding.UTF8.GetBytes(postData);

                // Set the ContentType property of the WebRequest.
                request.ContentType = "application / soap + xml";

                // Set the ContentLength property of the WebRequest.
                request.ContentLength = byteArray.Length;

                // Get the request stream. Stream = using System.IO;
                Stream dataStream = request.GetRequestStream();

                // Write the data to the request stream.
                dataStream.Write(byteArray, 0, byteArray.Length);

                // Close the Stream object.
                dataStream.Close();

                // Get the response.
                WebResponse response = request.GetResponse();
                Console.WriteLine("Get the response >>>----------> " + response.ToString());
                Console.WriteLine("HttpWebResponse >>>----------> " + ((HttpWebResponse)response).ToString());

                // Display the status.
                Console.WriteLine("Display the status >>>------------> " + ((HttpWebResponse)response).StatusDescription);

                // Get the stream containing content returned by the server.
                dataStream = response.GetResponseStream();
                Console.WriteLine("dataStream >>-----> " + dataStream);
                //view.Text = dataStream;

                // Open the stream using a StreamReader for easy access.
                StreamReader reader = new StreamReader(dataStream);

                // Read the content.
                string responseFromServer = reader.ReadToEnd();
                //Xml responseFromServer = reader.ReadToEnd();

                // Display the content.
                Console.WriteLine(responseFromServer);
                //viewXmleSearch.Text = responseFromServer;

                //------start for testing Display xml to table ------
                //Text1.Text = responseFromServer; //print to the text for testing only

                //string xmlString = File.ReadAllText(@"C:\Envelope.xml");
                //XmlDocument XmlData = new XmlDocument();
                //XmlData.LoadXml(responseFromServer);
                //Console.Write(XmlData);

                //var getDataFromBody = XmlData.GetElementsByTagName("soapenv:Body")[0];
                //string strXmlBody = getDataFromBody.InnerXml;

                //StringReader sr = new StringReader(strXmlBody);
                //DataSet ds = new DataSet();
                //ds.ReadXml(sr);
                //GridView1.DataSource = ds.Tables[0];
                //GridView1.DataBind();
                //------end for testing Display xml to table ------

                //######### Display xml to table #########
                XmlDocument XmlData = new XmlDocument();
                //string xmlString = File.ReadAllText(@"C:\Envelope.xml");
                //XmlData.LoadXml(xmlString);
                XmlData.LoadXml(responseFromServer);


                var getDataFromBody = XmlData.GetElementsByTagName("soapenv:Body")[0];
                //var getChildGst = getDataFromBody.SelectNodes("/soapenv:Body//vchgstnumber");
                string strXmlBody = getDataFromBody.InnerXml;
                XmlElement DocXmlElement = XmlData.DocumentElement;

                var dicRocStatus = new Dictionary<string, string>();
                dicRocStatus.Add("E", "EXISTING");
                dicRocStatus.Add("M", "WINDING UP");
                dicRocStatus.Add("D", "DISSOLVED");
                dicRocStatus.Add("R", "REMOVE");
                dicRocStatus.Add("C", "CEASED BUSINESS");
                dicRocStatus.Add("X", "NULL AND VOID BY COURT ORDER");
                dicRocStatus.Add("B", "DISSOLVED CONVERSION TO LLP");
                dicRocStatus.Add("Y", "STRUK OF AND WINDING-UP VIA COURT ORDER");

                var dicRobStatus = new Dictionary<String, String>();
                dicRobStatus.Add("A", "ACTIVE");
                dicRobStatus.Add("L", "EXPIRED");
                dicRobStatus.Add("T", "TERMINATED");
                dicRobStatus.Add("B", "DISSOLVE CONVERSION TO LLP");

                var dicLlpStatus = new Dictionary<String, String>();
                dicLlpStatus.Add("E", "EXISTING");
                dicLlpStatus.Add("S", "STRIKE OFF");
                dicLlpStatus.Add("W", "WINDING UP");
                dicLlpStatus.Add("CW", "WINDING UP BY COURT");
                dicLlpStatus.Add("VW", "VOLUNTARY WIDING UP");
                dicLlpStatus.Add("D", "DISSOLVED");
                dicLlpStatus.Add("ES", "IN PROCESS OF STRIKING OF");
                dicLlpStatus.Add("EV", "IN PROCESS OF VOLANTARY WINDING UP");
                dicLlpStatus.Add("EC", "IN PROCESS OF WINDING UP BY COURT");

                var dicRegisterCode = new Dictionary<String, String>();
                dicRegisterCode.Add("ROC", "Company Registration Number");
                dicRegisterCode.Add("ROB", "Business Registration Number");
                dicRegisterCode.Add("LLP", "LLP Registration Number");

                XmlNodeList nodeList;

                nodeList = DocXmlElement.GetElementsByTagName("companyNo");
                for (int i = 0; i < nodeList.Count; i++)
                {
                    String result = String.Empty;
                    String valueNode = String.Empty;
                    valueNode = nodeList[i].InnerText;

                    if (valueNode == "")
                    {
                        result = "-";
                    }
                    else
                    {
                        result = valueNode;
                        strXmlBody = strXmlBody.Replace(nodeList[i].InnerText, result);
                    }
                }


                nodeList = DocXmlElement.GetElementsByTagName("chkDigit");
                for (int i = 0; i < nodeList.Count; i++)
                {
                    String result = String.Empty;
                    String valueNode = String.Empty;
                    valueNode = nodeList[i].InnerText;

                    if (valueNode == "")
                    {
                        result = "-";
                    }
                    else
                    {
                        result = valueNode;
                        strXmlBody = strXmlBody.Replace(nodeList[i].InnerText, result);
                    }
                }

                nodeList = DocXmlElement.GetElementsByTagName("companyName");
                for (int i = 0; i < nodeList.Count; i++)
                {
                    String result = String.Empty;
                    String valueNode = String.Empty;
                    valueNode = nodeList[i].InnerText;

                    if (valueNode == "")
                    {
                        result = "-";
                    }
                    else
                    {
                        result = valueNode;
                        strXmlBody = strXmlBody.Replace(nodeList[i].InnerText, result);
                    }
                }

                nodeList = DocXmlElement.GetElementsByTagName("comStatus");
                for (int i = 0; i < nodeList.Count; i++)
                {
                    string valueList = nodeList[i].InnerText;
                    string result = string.Empty;
                    if (valueList == "")
                    {
                        result = "Tiada Rekod";
                        //strXmlBody = strXmlBody.Replace("<comStatus>" + nodeList[i].InnerText + "</comStatus>", "<comStatus>" + result + "</comStatus>");
                    }
                    else
                    {
                        if (dicRocStatus.ContainsKey(valueList))
                        {
                            result = dicRocStatus[valueList];
                            strXmlBody = strXmlBody.Replace("<comStatus>" + nodeList[i].InnerText + "</comStatus>", "<comStatus>" + result + "</comStatus>");
                        }
                    }
                }

                nodeList = DocXmlElement.GetElementsByTagName("bizStatus");
                for (int i = 0; i < nodeList.Count; i++)
                {
                    string valueList = nodeList[i].InnerText;
                    string result = string.Empty;
                    if (valueList == "")
                    {
                        result = "Tiada Rekod";
                    }
                    else
                    {
                        if (dicRobStatus.ContainsKey(valueList))
                        {
                            result = dicRobStatus[valueList];
                            strXmlBody = strXmlBody.Replace("<bizStatus>" + nodeList[i].InnerText + "</bizStatus>", "<bizStatus>" + result + "</bizStatus>");
                        }
                    }
                }

                nodeList = DocXmlElement.GetElementsByTagName("llpStatus");
                for (int i = 0; i < nodeList.Count; i++)
                {
                    string valueList = nodeList[i].InnerText;
                    string result = string.Empty;
                    if (valueList == "")
                    {
                        result = "Tiada Rekod";
                    }
                    else
                    {
                        if (dicLlpStatus.ContainsKey(valueList))
                        {
                            result = dicLlpStatus[valueList];
                            strXmlBody = strXmlBody.Replace("<bizStatus>" + nodeList[i].InnerText + "</bizStatus>", "<bizStatus>" + result + "</bizStatus>");
                        }
                    }
                }

                string gstno = "";
                nodeList = DocXmlElement.GetElementsByTagName("vchgstnumber");
                for (int i = 0; i < nodeList.Count; i++)
                {
                    gstno = nodeList[i].InnerText;
                }

                //nodeList = DocXmlElement.GetElementsByTagName("vchgstnumber");
                //XmlNodeList xnList = DocXmlElement.SelectNodes("/findGSTRegNoList/GSTRegNo");
                //foreach (XmlNode xn in xnList)
                //{
                //    string firstName = xn["FirstName"].InnerText;
                //    string lastName = xn["LastName"].InnerText;
                //    Console.WriteLine("Name: {0} {1}", firstName, lastName);
                //}
                // for (int i = 0; i < nodeList.Count; i++)
                // {
                //   String result = String.Empty;
                //  String valueNode = String.Empty;
                // valueNode = nodeList[i].InnerText;

                //  if (valueNode == "")
                // {
                //    result = "-";
                //strXmlBody = strXmlBody.Replace(nodeList[i].InnerText, result);
                // }
                // else
                // {
                //     result = valueNode;
                //    strXmlBody = strXmlBody.Replace(nodeList[i].InnerText, result);
                // }
                //   }

                StringReader sr = new StringReader(strXmlBody);
                DataSet ds = new DataSet();
                ds.ReadXml(sr);

                //disable untuk table no syarikat dan Company
                //GridVieweSearchCompany.DataSource = ds.Tables[0];
                //GridVieweSearchCompany.DataBind();

                int countRecord = ds.Tables.Count;
                if (countRecord > 0)
                {
                    if (regNo != "")
                    {
                        //lblIdAttention.Text = "<b>ATTENTION!</b> SSM shall not be held liable and responsible for any misuse of the information by irresponsible person.";

                        lblIdAttention.Text = "<div class='alert alert-warning'>" +
                                            "<i class='fa fa-info-circle'></i>" +
                                            "<strong>ATTENTION!</strong> SSM shall not be held liable and responsible for any misuse of the information by irresponsible person." +
                                            "</div>";

                        DateTime today = DateTime.Now;
                        string resultDay = today.ToString("dd/MM/yyyy");
                        lblIdToday.Text = "As at : " + resultDay;

                        lblIdGstNo.Text = "GST No. as at: 31/01/2016";

                        lblIdInformation.Text = "To purchase comprehensive COMPANY and BUSINESS information:" +
                                                "<ul class='mt-2'>" +
                                                "<li>Click<a href='http://www.mydata-ssm.com.my/' target='_blank'> HERE</a> for SSM MYDATA</li>" +
                                                "<li><a href='https://www.ssm-einfo.my/' target='_blank'> HERE </a> for SSM e-Info</li>" +
                                                "<li>To purchase comprehensive LLP information, click<a href='https://www.myllp.com.my/' target='_blank'> HERE</a></li>" +
                                               "</ul>";



                        if (dropType == "roc" || dropType == "rocNew")
                        {
                            GridViewRoc.DataSource = ds.Tables[0];
                            GridViewRoc.DataBind();
                            foreach (GridViewRow row in GridViewRoc.Rows)
                            {
                                if (row.RowType == DataControlRowType.DataRow)
                                {
                                    Label gstLabel = (Label)row.FindControl("lblIdGstNumber");
                                    gstLabel.Text = gstno;
                                    Label newNoCompany = (Label)row.FindControl("lblIdNewNoCompany");
                                    newNoCompany.Text = newFormatNo;
                                }
                            }

                            GridViewRob.DataSource = null;
                            GridViewLlp.DataSource = null;

                            GridViewRoc.Visible = true;
                            GridViewRob.Visible = false;
                            GridViewLlp.Visible = false;

                        }
                        else if (dropType == "rob" || dropType == "robNew")
                        {
                            GridViewRob.DataSource = ds.Tables[0];
                            GridViewRob.DataBind();
                            foreach (GridViewRow row in GridViewRob.Rows)
                            {
                                if (row.RowType == DataControlRowType.DataRow)
                                {
                                    Label gstLabel = (Label)row.FindControl("lblIdGstNumber");
                                    gstLabel.Text = gstno;
                                    Label newNoBusiness = (Label)row.FindControl("lblIdNewNoBusiness");
                                    newNoBusiness.Text = newFormatNo;

                                }
                            }
                            GridViewRoc.DataSource = null;
                            GridViewLlp.DataSource = null;

                            GridViewRoc.Visible = false;
                            GridViewRob.Visible = true;
                            GridViewLlp.Visible = false;
                        }
                        else if (dropType == "llp")
                        {
                            GridViewLlp.DataSource = ds.Tables[0];
                            GridViewLlp.DataBind();
                            foreach (GridViewRow row in GridViewLlp.Rows)
                            {
                                if (row.RowType == DataControlRowType.DataRow)
                                {
                                    Label gstLabel = (Label)row.FindControl("lblIdGstNumber");
                                    gstLabel.Text = gstno;
                                }
                            }
                            GridViewRoc.DataSource = null;
                            GridViewRob.DataSource = null;

                            GridViewRoc.Visible = false;
                            GridViewRob.Visible = false;
                            GridViewLlp.Visible = true;
                        }

                    }

                    else
                    {
                        //display no record
                        DisplayNoRecord();
                    }
                }
                else
                {
                    DisplayNoRecord();
                }
                
                reader.Close();
                dataStream.Close();
                response.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        protected void idDropRegistrationType_SelectedIndexChanged(object sender, EventArgs e)
        {
            ChangeExample();
        }

        protected void ChangeExample()
        {
            //DropDownList list = (DropDownList)sender;
            //string dropValue = (string)list.SelectedValue;

            var dropValue = idDropRegistrationType.SelectedValue.ToString();
            if (dropValue.Equals("roc"))
            {
                idExample.Text = "EXAMPLE : 123456";
            }
            else if (dropValue.Equals("rob"))
            {
                idExample.Text = "EXAMPLE : 123456789";
            }
            else if (dropValue.Equals("rocNew"))
            {
                idExample.Text = "EXAMPLE : 201902123456";
            }
            else if (dropValue.Equals("robNew"))
            {
                idExample.Text = "EXAMPLE : 201903123456";
            }
            else if (dropValue.Equals("llp"))
            {
                idExample.Text = "EXAMPLE : LLP00012345-LGN";
            }
        }

        private string getNewOldFomratCompanyNo(string regNo, string regNoType, String regNoFormatType, string usr, string psw, string url)
        {
            //var token = CustomCodes.WebAdmin.Tools.AuthTokenGen.Default.GenerateToken(usr, psw);
            var token = GenerateToken(usr, psw);
            //HttpWebRequest request1 = (HttpWebRequest)WebRequest.Create("http://" + url + "/InfoService/1");
            WebRequest request = WebRequest.Create("http://" + url + "/InfoService/1");
            request.Timeout = 5 * 1000;
            request.Method = "POST";
            request.Headers.Add("Authorization", token);
            DateTime today = DateTime.Now;
            string agencyId = "SSMPORTAL1";
            string chkDigit = "";

            string postData1 = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ws=\"http://" + url + "/InfoService/1/WS\">" +
                                "<soapenv:Header/>" +
                                "<soapenv:Body>" +
                                "<ws:getNewFormatEntityNo>" +
                                        "<header>" +
                                        "<customerId>" + agencyId + "</customerId>" +
                                        "<customerRequestDate>" + today + "</customerRequestDate>" +
                                        "</header>" +
                                    "<request>" +
                                        "<newFormatEntityNoReq>" +
                                            "<agencyId>" + agencyId + "</agencyId>" +
                                            "<checkDigit>" + chkDigit + "</checkDigit>" +
                                            "<formatType>" + regNoFormatType + "</formatType>" +
                                            "<regNo>" + regNo + "</regNo>" +
                                            "<tableId>NEWROCROBREGNO</tableId>" +
                                            "<type>" + regNoType + "</type>" +
                                         "</newFormatEntityNoReq>" +
                                    "</request>" +
                                 "</ws:getNewFormatEntityNo>" +
                                "</soapenv:Body>" +
                        "</soapenv:Envelope>";

            byte[] byteArray = Encoding.UTF8.GetBytes(postData1);
            request.ContentType = "application / soap + xml";
            request.ContentLength = byteArray.Length;
            Stream dataStream = request.GetRequestStream();
            dataStream.Write(byteArray, 0, byteArray.Length);
            dataStream.Close();
            WebResponse response = request.GetResponse();
            dataStream = response.GetResponseStream();
            StreamReader reader = new StreamReader(dataStream);

            string responseFromServer = reader.ReadToEnd();

            // Display the content.
            Console.WriteLine(responseFromServer);
            XmlDocument XmlData = new XmlDocument();
            XmlData.LoadXml(responseFromServer);

            var getDataFromBody = XmlData.GetElementsByTagName("soapenv:Body")[0];
            //var getChildGst = getDataFromBody.SelectNodes("/soapenv:Body//vchgstnumber");
            string strXmlBody = getDataFromBody.InnerXml;
            XmlElement DocXmlElement = XmlData.DocumentElement;

            //XElement xmlDocumentWithoutNs = RemoveAllNamespaces(XElement.Parse(strXmlBody));
            //strXmlBod.ToString();
            //Console.WriteLine("REMOVE xmlns ===== " + strXmlBody);

            XmlDocument xmldoc = new XmlDocument();
            xmldoc.LoadXml(strXmlBody);
            XmlNodeList nodeList = null;
            if (regNoFormatType == "NEW")
            {
                nodeList = xmldoc.GetElementsByTagName("oldFormatNo");
            }
            if (regNoFormatType == "OLD")
            {
                nodeList = xmldoc.GetElementsByTagName("newFormatNo");
            }

            string companyNum = string.Empty;
            foreach (XmlNode node in nodeList)
            {
                companyNum = node.InnerText;
            }
            return companyNum;
        }

        public static string GenerateToken(string username, string password)
        {
            string str1 = string.Empty;
            string str2 = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            string base64String = Convert.ToBase64String(GetHashSha256Byte(string.Join("|", username, str2, password)));
            string s = string.Join("|", username, str2, base64String);
            return str1 = Convert.ToBase64String(Encoding.UTF8.GetBytes(s));
        }

        private static byte[] GetHashSha256Byte(string pipeValues)
        {
            SHA256Managed shA256Managed = new SHA256Managed();
            StringBuilder stringBuilder = new StringBuilder();
            return shA256Managed.ComputeHash(Encoding.UTF8.GetBytes(pipeValues), 0, Encoding.UTF8.GetByteCount(pipeValues));
        }

        public void DisplayNoRecord()

        {
            String method = String.Empty;
            String entityParam = String.Empty;
            String dropType = idDropRegistrationType.SelectedItem.Value;
            if (dropType == "roc" || dropType == "rocNew")
            {
                method = "findRoc";
                entityParam = "companyNo";
            }
            else if (dropType == "rob" || dropType == "robNew")
            {
                method = "findRob";
                entityParam = "bizRegNo";
            }
            else if (dropType == "llp")
            {
                method = "findLlp";
                entityParam = "llpNo";
            }

            lblIdAttention.Text = null;
            lblIdToday.Text = null;
            lblIdGstNo.Text = null;
            lblIdInformation.Text = null;

            if (dropType == "roc" || dropType == "rocNew")
            {
                GridViewRoc.DataSource = null;
                GridViewRoc.DataBind();
                GridViewRob.DataSource = null;
                GridViewRob.DataBind();
                GridViewLlp.DataSource = null;
                GridViewLlp.DataBind();

                GridViewRoc.Visible = true;
                GridViewRob.Visible = false;
                GridViewLlp.Visible = false;
            }
            else if (dropType == "rob" || dropType == "robNew")
            {
                GridViewRoc.DataSource = null;
                GridViewRoc.DataBind();
                GridViewRob.DataSource = null;
                GridViewRob.DataBind();
                GridViewLlp.DataSource = null;
                GridViewLlp.DataBind();

                GridViewRoc.Visible = false;
                GridViewRob.Visible = true;
                GridViewLlp.Visible = false;
            }
            else if (dropType == "llp")
            {
                GridViewRoc.DataSource = null;
                GridViewRoc.DataBind();
                GridViewRob.DataSource = null;
                GridViewRob.DataBind();
                GridViewLlp.DataSource = null;
                GridViewLlp.DataBind();

                GridViewRoc.Visible = false;
                GridViewRob.Visible = false;
                GridViewLlp.Visible = true;
            }


        }

        protected void GridViewRoc_SelectedIndexChanged(object sender, EventArgs e)
        {

        }
    }
}
