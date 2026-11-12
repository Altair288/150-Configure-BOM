# Product Family Objects

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/ProdFamProductFamilyObjects.html)  
> 获取日期：2026-11-12

<a id="wwID0EFXXT"></a>

<a id="wwID0EWXXT"></a>

The objects within a Product Family are used to organize related products that share common components into a hierarchical structure. The product structure can be mapped to planned products based on business requirements. A Product Family structure begins with a Product Family object as the top node within the hierarchy, and then products models and variant specifications are arranged based on shared designs or business requirements. The following objects are used to create a Product Family structure.

<table border="1">
              <tr>
                <th>
                  <div id="wwID0EAZXT">Icon</div>
                </th>
                <th>
                  <div id="wwID0EMZXT">Object</div>
                </th>
                <th>
                  <div id="wwID0EYZXT">Description</div>
                </th>
              </tr>
              <tr>
                <td><div><div id="wwID0EF1XT"><img src="../../../../images/da3957c3136a_IconProductFamily.png" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EZ1XT">Product Family</div>
                </td>
                <td>
                  <div id="wwID0ED2XT">Parent object under which other Product Family objects are arranged to create a structure to organize, plan, and design product models and variant specifications that share the same configurable structure and use common components.</div><div><div id="wwID0EH2XT">Product families can be created in <span>Product</span> <img src="../../../../images/2dedd3528cf9_IconProduct.gif" alt="" /> and <span>Library</span> <img src="../../../../images/34825043290b_IconLibrary.gif" alt="" /> application contexts. Product families are listed in the <span><a href="../03-product-families-table/index.md#wwID0EZKYT">Product Families</a></span><span><a href="../03-product-families-table/index.md#wwID0EZKYT"> table</a></span> on the application context’s information page.</div></div><div id="wwID0EU3XT">A Product Family cannot be deleted, however its state can be set to cancelled to indicate the Product Family is no longer in use. You can set the state for a Product Family object from its information page with <span>Actions</span> &gt; <span>Set State</span>.</div></td>
              </tr>
              <tr>
                <td><div><div id="wwID0EN4XT"><img src="../../../../images/5e48c5e44c69_IconProductModelGroup.png" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EC5XT">Product Model Group</div>
                </td>
                <td>
                  <div id="wwID0EM5XT">Organizational node under which groups of product models can be organized. Additional product model groups can be placed under a parent product model group for additional organization layers. Can be inserted under a Product Family node and other product model groups.</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0E45XT"><span><img src="../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0EG6XT">You can define rules for organizing product model groups.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0EP6XT"><img src="../../../../images/e785da91839e_IconProductModel.png" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EFAYT">Product Model</div>
                </td>
                <td>
                  <div id="wwID0EQAYT">Lowest level of the organizational structure. Only variant specifications can be created under product models.</div>
                  <div id="wwID0EUAYT">Represents a marketable product. Can be placed under a Product Family or product model group. Variant specifications and managed variant specifications can be inserted as child nodes under a product model.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0E4AYT"><img src="../../../../images/2dcf030167df_IconVarSpecPFM.png" alt="" /></div></div></td>
                <td>
                  <div id="wwID0ETBYT">Managed Variant Specification</div>
                </td>
                <td>
                  <div id="wwID0E5BYT">A variant specification created in the context of a Product Family. The object represents the option filter criteria that meets a specific marketable configuration of the product. For example, the options for a bicycle model are filtered to account for the region in which the variant specification will be sold. Can be placed under a product model.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0EMCYT"><img src="../../../../images/ca4935c1bfcc_IconProductVariant.png" alt="" /></div></div><div><div id="wwID0E1CYT"><img src="../../../../images/f8de7618c379_IconVarSpecInsert.png" alt="" /></div></div></td>
                <td>
                  <div id="wwID0ENDYT">Variant Specification</div>
                </td>
                <td><div><div id="wwID0EXDYT">Represents a variant configuration for the product model. Initially variant specifications are “stand alone” objects that are not associated with a Product Family. When a variant specification is inserted into a Product Family structure, the object’s icon changes to<img src="../../../../images/f8de7618c379_IconVarSpecInsert.png" alt="" />, indicating that it is referenced in a Product Family. The options selected for a variant specification are based on selections made during the configuration process or programmatically. For more information, see <span><a href="../../../01-windchill-opt-7075e8a3/08-creating-and-a9cfd907/index.md#wwID0EQLNS">Creating and Managing Variants</a></span>.</div></div><div id="wwID0EOEYT">To view the variant specifications for a product variant:</div><div id="wwID0EGFYT"><span><span>1. </span></span>On the <span>Variant Baseline</span> information page, click the <span>Variant Specifications</span> tab.</div><div id="wwID0EQGYT"><span><span>2. </span></span>In this tab, click the <span>View Information</span> icon for a managed variant specification in the <span>Variant Specifications</span> table.</div><div id="wwID0EKHYT">For more details on variant specifications, see <span><a href="../10-managing-vari-9babf126/01-variant-speci-5c9c8f47/index.md#wwID0EEG5T">Variant Specification Information Page</a></span>.</div></td>
              </tr>
              <tr>
                <td><div><div id="wwID0EBIYT"><img src="../../../../images/dd3c2ac659af_IconLotBaseline.png" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EVIYT">Variant Baseline</div>
                </td>
                <td>
                  <div id="wwID0E6IYT">A snapshot of a variant specification that has reached sufficient completeness in the design stage to begin validation and creation of a prototype. Can be optionally displayed in the Product Family structure under their associated product models. Variant specifications that have been added to the variant baseline are displayed under the variant baseline within the structure, as well as under their parent product model.</div>
                  <div id="wwID0EDJYT">If you hide a variant baseline, the latest revision of a variant specification that is not in a variant baseline is displayed.</div>
                </td>
              </tr>
            </table>

<a id="wwID0EMJYT"></a>

Based on the out-of-the-box product and library container templates, participants in the Product Family Manager role have full control (All) permission on these objects in all the states. Product and library team members have Read permission on these objects in all the states.

<a id="wwID0EYJYT"></a>

## Related Links
