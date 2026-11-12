# Creating and Managing Variants

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsVariantsCreatUpdate.html)  
> 获取日期：2026-11-12

<a id="wwID0EQLNS"></a>

<a id="wwID0EBMNS"></a>

A variant specification is a managed definition of a filter that, when applied to a configurable part, fully or partially defines a variant. Different variant specifications offer different capabilities to fulfill different business process requirements and the system classifies a variant specification based on its usage.

<table border="1">
              <tr>
                <th>
                  <div id="wwID0ELNNS">Icon</div>
                </th>
                <th>
                  <div id="wwID0EXNNS">Variant Specification Classification</div>
                </th>
                <th>
                  <div id="wwID0EDONS">Description</div>
                </th>
              </tr>
              <tr>
                <td><div><div id="wwID0EQONS"><img src="../../../images/0a1a2f565ed0_IconVariantSpec.gif" alt="" /></div></div></td>
                <td>
                  <div id="wwID0ECPNS">Variant Specification</div>
                </td>
                <td>
                  <div id="wwID0EMPNS">This variant specification, also known as a standalone variant specification, is used to manage a fully-defined filter applied to a specific view version to define, and optionally to generate, a variant solution or configuration context. It is created using the “Configure” process or programmatically loaded from a spreadsheet. It is updated through the “Reconfigure” process. This is the only variant specification process supporting Advanced Logic. One or more standalone variant specifications may be generated in a single interaction using the “Configure Multiple Variants” process.</div>
                  <div id="wwID0EQPNS">For more information, see <span><a href="02-creating-vari-da7dff17/index.md#wwID0EPGOS">Creating Variant Structures Using the Configure Process</a></span>, <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/WCDataLoadGuide/WCDataLoad_OptionsLoadVarSpecSpreadsheet.html">Loading Variant Specifications from a Spreadsheet</a></span>, or <span><a href="../../03-developing-ad-954fbdfc/04-creating-mult-822231e7/index.md">Creating Multiple Variant Structures Using the Configure Multiple Variants Process for Advanced Selection Logic</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0EYQNS"><img src="../../../images/f8de7618c379_IconVarSpecInsert.png" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EMRNS">Variant Specification</div>
                </td>
                <td>
                  <div id="wwID0EXRNS">This variant specification, also knows as an organized variant specification, is a standalone variant that is added into a product family as a child of a product model. This variant exists outside of a product family structure. An example of a standalone variant specification is a variant specification that is created using the Configure action on a configurable part.</div>
                  <div id="wwID0E2RNS">For more information, see <span><a href="05-variant-part-6a8db4b0/index.md#wwID0EW6TS">Variant Specification Information Page</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0EPSNS"><img src="../../../images/2dcf030167df_IconVarSpecPFM.png" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EDTNS">Managed Variant Specification</div>
                </td>
                <td>
                  <div id="wwID0EOTNS">This variant specification is created in a product family as a child of a product model by first defining only the object’s metadata (name, number, folder location, and description). After it is created, an option filter can be defined using the <span>Edit Option Filter</span> window. Module variants selections can be manually defined by using the <span>Modules</span> tab. This variant specification works in combination with a variant baseline and its released configuration as supported exclusively in the Product Family Matrix Editor.</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0EIUNS"><span><img src="../../../images/23680a139aaf_info_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0ESUNS">When using managed variant specifications, it is a best practice to use them within the Matrix Editor to ensure that the appropriate variant baseline and release configuration are used.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div id="wwID0EWUNS">For more information, see <span><a href="../../04-managing-produc-f3f2ad/01-product-family-673356/10-managing-vari-9babf126/02-creating-and-a77fa1f5/index.md">Creating and Managing Variant Specifications</a></span> and <span><a href="../../04-managing-produc-f3f2ad/01-product-family-673356/10-managing-vari-9babf126/04-configuring-a-1784561b/index.md">Configuring a Managed Variant Specification Using Manual Selection</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0E1VNS"><img src="../../../images/1567a5c37f9a_Icon_VarSpecOptionSet.png" alt="" /></div></div></td>
                <td>
                  <div id="wwID0ELWNS">Variant Specification</div>
                </td>
                <td>
                  <div id="wwID0EWWNS">This variant specification is used to manage a fully-defined filter applicable to configurable modules or different view versions of the same configurable module associated with the same option set. As such, it does not support generating a variant solution or configuration context. It is created using the <span>New Variant Specification</span> process or is programmatically loaded from a spreadsheet and updated using the <span>Edit Variant Specification Filter</span> action.</div>
                  <div id="wwID0EDXNS">For more information, see <span><a href="01-creating-a-va-c18a29b7/index.md#wwID0EH2NS">Creating a Variant Specification for an Option Set</a></span> and <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/WCDataLoadGuide/WCDataLoad_OptionsLoadVarSpecSpreadsheet.html">Loading Variant Specifications from a Spreadsheet</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0EKYNS"><img src="../../../images/e6cd54f8c1a0_Icon_ManagedOptionFilter.png" alt="" /></div></div></td>
                <td>
                  <div id="wwID0E2YNS">Managed Option Filter</div>
                </td>
                <td>
                  <div id="wwID0EGZNS">This variant specification is limited to managing the Option Filter and Option Filter configuration specification applicable to the configurable modules or different view versions of the same configurable module associated with the same option set. When applied to a structure, the default configuration specification is automatically used. As such, it does not support generating a variant solution or configuration context. It is created using the <span>New Variant Specification</span> process or is programmatically loaded from a spreadsheet and updated using the <span>Edit Variant Specification Filter</span> action.</div>
                  <div id="wwID0ETZNS">For more information, see <span><a href="01-creating-a-va-c18a29b7/index.md#wwID0EH2NS">Creating a Variant Specification for an Option Set</a></span> and <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/WCDataLoadGuide/WCDataLoad_OptionsLoadVarSpecSpreadsheet.html">Loading Variant Specifications from a Spreadsheet</a></span>.</div>
                </td>
              </tr>
            </table>
