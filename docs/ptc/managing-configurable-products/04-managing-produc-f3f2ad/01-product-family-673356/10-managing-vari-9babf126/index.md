# Managing Variant Specifications in a Product Family

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/ProdFamilyCreatingProductVariants.html)  
> 获取日期：2026-11-12

<a id="wwID0ERZ4T"></a>

<a id="wwID0EC14T"></a>

A Product Family manager can insert variants of a product model that represent a specific configuration of the product called a variant specification. These variant specifications are added as children of product models in the Product Family structure. When creating a variant specification from a Product Family structure, a limited definition of the object can be created in which only meta data (such as name, number, and description) is specified. Later, an option filter can be defined that, when applied to the inherited configurable product structure, represents a variant configuration of the product model.

<a id="wwID0EH14T"></a>

The system classifies a variant specification object based on its usage.

<table border="1">
              <tr>
                <th>
                  <div id="wwID0ER24T">Icon</div>
                </th>
                <th>
                  <div id="wwID0E424T">Variant Specification Classification</div>
                </th>
                <th>
                  <div id="wwID0EJ34T">Description</div>
                </th>
              </tr>
              <tr>
                <td><div><div id="wwID0EW34T"><img src="../../../../images/0a1a2f565ed0_IconVariantSpec.gif" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EK44T">Variant Specification</div>
                </td>
                <td>
                  <div id="wwID0EU44T">Standalone variant that is created using the configure process or programmatically from a spreadsheet. For more information, see <span><a href="../../../01-windchill-opt-7075e8a3/08-creating-and-a9cfd907/02-creating-vari-da7dff17/index.md#wwID0EPGOS">Creating Variant Structures Using the Configure Process</a></span> and <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/WCDataLoadGuide/WCDataLoad_OptionsLoadVarSpecSpreadsheet.html">Loading Variant Specifications from a Spreadsheet</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0ES54T"><img src="../../../../images/2dcf030167df_IconVarSpecPFM.png" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EI64T">Managed Variant Specification</div>
                </td>
                <td>
                  <div id="wwID0ET64T">Variant that is created in a product family as a child of a product model by first defining only the object’s metadata (name, number, folder location, and description). After it is created, an option filter can be defined using the <span>Edit Option Filter</span> window. Module variants selections can be manually defined by using the <span>Modules</span> tab. This variant specification works in combination with a variant baseline and its released configuration as supported exclusively in the Product Family Matrix Editor.</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0ENA5T"><span><img src="../../../../images/23680a139aaf_info_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0EXA5T">When using managed variant specifications, it is a best practice to use them within the Matrix Editor to ensure that the appropriate variant baseline and release configuration are used.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0EAB5T"><img src="../../../../images/f8de7618c379_IconVarSpecInsert.png" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EWB5T">Organized Variant Specification</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0EHC5T"><span><img src="../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0EQC5T">The tooltip for this icon appears as <span>Variant Specification</span> in the application’s user interface.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
                <td>
                  <div id="wwID0EAD5T">A variant specification that is originally created as a standalone variant (using the configure process or programmatically) and can later be inserted into a product family as a child of a product model. Once added, it becomes individually defined and managed within the product family structure, effectively making it an organized variant specification. This type of variant retains its standalone origin but is structurally tied to the product family for ongoing management and organization.</div>
                  <div id="wwID0EED5T">For more information, see <span><a href="../../../01-windchill-opt-7075e8a3/08-creating-and-a9cfd907/05-variant-part-6a8db4b0/index.md#wwID0EW6TS">Variant Specification Information Page</a></span>.</div>
                </td>
              </tr>
            </table>

<a id="wwID0EZD5T"></a>

Because a managed variant specification can be partially defined with only metadata, it can be added to a product family structure as a placeholder for planning purposes. At a later time, as the designs for component parts of the configurable product are created, the variant specification can further define the appropriate choice selections within its option filter definition.
