<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %> 
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="VisualWebPart1UserControl.ascx.cs" Inherits="eSearchBaruTesting.VisualWebPart1.VisualWebPart1UserControl" %>

<html>
<head>
     <title></title>
        <script src='https://www.google.com/recaptcha/api.js'></script>
        <script type="text/javascript">  
            _spBodyOnLoadFunctionNames.push("disableSubmit()");  
            function disableSubmit()  
            {
                //alert("Disable Working");
                //Get all Input Elements on the page  
                var inputs = document.getElementById("<%=idBtneSearch.ClientID%>");    
                inputs.disabled = "true";
            }  
        </script>
</head>
<body>
         <div>
        <h1><strong></strong><span class="ms-rteThemeForeColor-6-4" style="font-family:inherit;font-size:25px;"><strong>e-Search</strong></span></h1>
    </div>
    <br />
    <%--<div class="mb-3">
                    <b>Status of Application to e-Search</b>
    </div>--%>

    <%--//------for testing Display xml to table --------%>
    <%--<asp:TextBox ID="Text1" runat="server"></asp:TextBox>--%>
    <%--<asp:GridView ID="GridView1" runat="server"></asp:GridView>--%>
    <div class="form-group">
        <!-- REGISTRATION TYPE -->
        <div class="form-group">
            <label for="registration_type">
                Registration Type
            </label>
            <%--<select name="registration_type" class="form-control t-13" id="registrationtype">
                <option value="ROC">Company Registration Number</option>
                <option value="ROB">Business Registration Number</option>
                <option value="LLP">LLP Registration Number</option>
            </select>--%>
            <asp:DropDownList ID="idDropRegistrationType" runat="server" Height="39px" Width="100%" CssClass="form-control t-13" OnSelectedIndexChanged="idDropRegistrationType_SelectedIndexChanged" AutoPostBack="True">
                <asp:ListItem Value="roc">Company Registration Number Old</asp:ListItem>
                <asp:ListItem Value="rob">Business Registration Number Old</asp:ListItem>
                <asp:ListItem Value="rocNew">Company Registration Number New</asp:ListItem>
                <asp:ListItem Value="robNew">Business Registration Number New</asp:ListItem>
                <asp:ListItem Value="llp">LLP Registration Number</asp:ListItem>
            </asp:DropDownList>

        </div>
        
        <%--REGISTRATION NUMBER--%>
        <div class="form-group">
            <label for="registration_number">
                Registration Number
            </label>
            <%--<input type="text" class="form-control t-13" name="registration_number" placeholder="Registration Number" />--%>
            <asp:TextBox ID="txtCarieSearch" runat="server" placeholder="Registration Number" class="form-control t-13" Height="40px" Width="100%"></asp:TextBox>
            <%--<p id="example-display" class="mt-2">
                Example: 123456
            </p>--%>
            <asp:Label ID="idExampleDefault" runat="server"></asp:Label>
            <asp:Label ID="idExample" runat="server"></asp:Label>
        </div>
        
    </div>

    <!-- GOOGLE RECAPTCHA -->
    <div class="g-recaptcha mb-3" data-sitekey="6Leaa0QUAAAAANCJadGdmcmp800BbZ_Z9vjZjCiH" data-callback="enableButton"></div>
    <script type="text/javascript">
        function enableButton() {
            //alert("Enable Working");
            var btnSubmit = document.getElementById("<%=idBtneSearch.ClientID%>");
            btnSubmit.disabled = false;
        }                                
    </script>

    <%--BUTTON--%>
    <div class="form-group">
        <%--<input disabled="disabled" id="google-recaptcha-checking" type="submit" class="btn btn-primary btn-sm" name="search" value="Search Now"/>--%>
        <asp:Button ID="idBtneSearch" runat="server" OnClick="btnCari_eSearch" Text="Search Now" class="btn btn-primary btn-md" />
                </div>  
    
    <%--DISPLAY RECORD--%>
    <div>
        <!-- Start TABLE RESULT -->
        <%--XML : <asp:TextBox ID="viewXmleSearch" runat="server" Height="100px" Width="100%"></asp:TextBox><br />--%>
        <%--<asp:GridView ID="GridVieweSearchCompany" runat="server" AutoGenerateColumns="False" CellPadding="5" ForeColor="#333333" GridLines="None" Height="51px" Width="100%" AllowPaging="True" PageSize="1">
            <AlternatingRowStyle BackColor="White" />
            <Columns>
                <asp:TemplateField HeaderText="Name">
                    <ItemTemplate>
                        --<asp:Label ID="Label1" runat="server" Text='<%# Bind("companyNo") %>'></asp:Label>-<asp:Label ID="Label2" runat="server" Text='<%# Bind("checkDigit") %>'></asp:Label>--
                        <%#Eval("companyNo") %>-<%#Eval("checkDigit") %>
                    </ItemTemplate>
                </asp:TemplateField>
                    
                <asp:BoundField DataField="companyName" HeaderText="Company Name" />
            </Columns>
            <EditRowStyle BackColor="#2461BF" />
            <FooterStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
            <HeaderStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" Height="40px" />
            <PagerSettings Visible="False" />
            <PagerStyle BackColor="#2461BF" ForeColor="White" HorizontalAlign="Center" />
            <RowStyle BackColor="#EFF3FB" Height="40px" />
            <SelectedRowStyle BackColor="#D1DDF1" Font-Bold="True" ForeColor="#333333" />
            <SortedAscendingCellStyle BackColor="#F5F7FB" />
            <SortedAscendingHeaderStyle BackColor="#6D95E1" />
            <SortedDescendingCellStyle BackColor="#E9EBEF" />
            <SortedDescendingHeaderStyle BackColor="#4870BE" />
        </asp:GridView>
        <br />--%>
       
        <br/>
        <asp:Label ID="lblIdAttention" runat="server"></asp:Label>
        <br />
       
        <%--ROC--%>
        <asp:GridView ID="GridViewRoc" runat="server" AutoGenerateColumns="False" CellPadding="4" ForeColor="#333333" GridLines="None" Height="100%" Width="100%" EmptyDataText="No Record Found." ShowHeaderWhenEmpty="True" EmptyDataRowStyle-CssClass="alert-info" OnSelectedIndexChanged="GridViewRoc_SelectedIndexChanged">
            <AlternatingRowStyle BackColor="White" />
            <Columns>
                <%--<asp:BoundField DataField="companyNo" HeaderText="Registration Number" />--%>
                <asp:TemplateField HeaderText="Registration Number">
                    <ItemTemplate>
                        <%#Eval("companyNo") %>-<%#Eval("chkDigit") %>
                    </ItemTemplate>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="New Registration Number"> <ItemTemplate> <asp:Label ID="lblIdNewNoCompany" runat="server"></asp:Label> </ItemTemplate> </asp:TemplateField>
                
                <asp:BoundField DataField="companyName" HeaderText="Entity Type"/>
                <asp:BoundField DataField="comStatus" HeaderText="Status" />
                <%--<asp:BoundField DataField="GSTRegNo" HeaderText="Gst Number" />--%>
              <asp:TemplateField HeaderText="GST Number"> <ItemTemplate> <asp:Label ID="lblIdGstNumber" runat="server"></asp:Label> </ItemTemplate> </asp:TemplateField>
            </Columns>
            <EditRowStyle BackColor="#2461BF" Height="50px" />

<EmptyDataRowStyle CssClass="alert-info"></EmptyDataRowStyle>

            <FooterStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
            <HeaderStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" Height="40px" HorizontalAlign="Left" />
            <PagerStyle BackColor="#2461BF" ForeColor="White" HorizontalAlign="Left" />
            <RowStyle BackColor="#EFF3FB" Height="40px" />
            <SelectedRowStyle BackColor="#D1DDF1" Font-Bold="True" ForeColor="#333333" />
            <SortedAscendingCellStyle BackColor="#F5F7FB" />
            <SortedAscendingHeaderStyle BackColor="#6D95E1" />
            <SortedDescendingCellStyle BackColor="#E9EBEF" />
            <SortedDescendingHeaderStyle BackColor="#4870BE" />
        </asp:GridView>
        
        <%--ROB--%>
        <asp:GridView ID="GridViewRob" runat="server" AutoGenerateColumns="False" CellPadding="4" ForeColor="#333333" GridLines="None" Height="100%" Width="100%" EmptyDataText="No Record Found." ShowHeaderWhenEmpty="True" EmptyDataRowStyle-CssClass="alert-info">
            <AlternatingRowStyle BackColor="White" />
            <Columns>
                 <%--<asp:BoundField DataField="bizRegNo" HeaderText="Registration Number" />--%>
                <asp:TemplateField HeaderText="Registration Number">
                    <ItemTemplate>
                        <%#Eval("bizRegNo") %>-<%#Eval("chkDigit") %>
                    </ItemTemplate>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="New Registration Number"> <ItemTemplate> <asp:Label ID="lblIdNewNoBusiness" runat="server"></asp:Label> </ItemTemplate> </asp:TemplateField>
                
                <asp:BoundField DataField="bizName" HeaderText="Entity Type"/>
                <asp:BoundField DataField="bizStatus" HeaderText="Status" />
                <%--<asp:BoundField DataField="GSTRegNo" HeaderText="Gst Number" />--%>
                <asp:TemplateField HeaderText="GST Number"> <ItemTemplate> <asp:Label ID="lblIdGstNumber" runat="server"></asp:Label> </ItemTemplate> </asp:TemplateField>
            </Columns>
            <EditRowStyle BackColor="#2461BF" Height="50px" />
            <FooterStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
            <HeaderStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" Height="40px" />
            <PagerStyle BackColor="#2461BF" ForeColor="White" HorizontalAlign="Left" />
            <RowStyle BackColor="#EFF3FB" Height="40px" />
            <SelectedRowStyle BackColor="#D1DDF1" Font-Bold="True" ForeColor="#333333" />
            <SortedAscendingCellStyle BackColor="#F5F7FB" />
            <SortedAscendingHeaderStyle BackColor="#6D95E1" />
            <SortedDescendingCellStyle BackColor="#E9EBEF" />
            <SortedDescendingHeaderStyle BackColor="#4870BE" />
        </asp:GridView>

        <%--LLP--%>
        <asp:GridView ID="GridViewLlp" runat="server" AutoGenerateColumns="False" CellPadding="4" ForeColor="#333333" GridLines="None" Height="100%" Width="100%" EmptyDataText="No Record Found." ShowHeaderWhenEmpty="True" EmptyDataRowStyle-CssClass="alert-info">
            <AlternatingRowStyle BackColor="White" />
            <Columns>
                <asp:BoundField DataField="llpNo" HeaderText="Registration Number" />
                <asp:BoundField DataField="llpName" HeaderText="Entity Type"/>
                <asp:BoundField DataField="llpStatus" HeaderText="Status" />
                <asp:TemplateField HeaderText="GST Number">
                    <ItemTemplate>
                        <asp:Label ID="lblIdGstNumber" runat="server"></asp:Label>
                    </ItemTemplate>
                </asp:TemplateField>
                <%--<asp:BoundField DataField="GSTRegNo" HeaderText="Gst Number" />--%>
                <%--<asp:BoundField DataField="vchgstnumber" HeaderText="Gst Number" />--%>
            </Columns>
            <EditRowStyle BackColor="#2461BF" Height="50px" />
            <FooterStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
            <HeaderStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" Height="40px" />
            <PagerStyle BackColor="#2461BF" ForeColor="White" HorizontalAlign="Left" />
            <RowStyle BackColor="#EFF3FB" Height="40px" />
            <SelectedRowStyle BackColor="#D1DDF1" Font-Bold="True" ForeColor="#333333" />
            <SortedAscendingCellStyle BackColor="#F5F7FB" />
            <SortedAscendingHeaderStyle BackColor="#6D95E1" />
            <SortedDescendingCellStyle BackColor="#E9EBEF" />
            <SortedDescendingHeaderStyle BackColor="#4870BE" />
        </asp:GridView>
        <br />
        <asp:Label ID="lblIdToday" runat="server"></asp:Label>
        <br />
        <asp:Label ID="lblIdGstNo" runat="server"></asp:Label>
        <br /><br />
        <asp:Label ID="lblIdInformation" runat="server"></asp:Label>
    </div>
</body>
</html>







