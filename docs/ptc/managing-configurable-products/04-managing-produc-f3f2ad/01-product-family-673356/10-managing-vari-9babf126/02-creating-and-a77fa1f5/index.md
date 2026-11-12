# Creating and Managing Variant Specifications

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/ProdFamilyCreateAndManageVarSpecs.html)  
> 获取日期：2026-11-12

<a id="wwID0E5S5T"></a>

<a id="wwID0EKT5T"></a>

To create a new managed variant specification in a Product Family structure, use the following procedure.

<a id="wwID0EDU5T"></a>

1. Select the product model under which you want to insert a new variant specification.

<a id="wwID0EFV5T"></a>

2. Click **Insert New** from the **Structure** tab tool bar or the right-click actions menu on the product model. The **Insert New Product Family Member** window opens.

<a id="wwID0ETW5T"></a>

3. If available, select a variant specification type in the **Type** field. (Multiple types can be defined by the system administrator.)

<a id="wwID0EZX5T"></a>

4. Specify a name.

<a id="wwID0E2Y5T"></a>

5. Optional: select a folder location where the variant specification will be stored. By default, it is saved in the root folder of the product or library context.

<a id="wwID0E4Z5T"></a>

6. Optional: provide a description.

<a id="wwID0E615T"></a>

7. Click **OK**.

<a id="wwID0EW25T"></a>

To insert an existing variant specification into a Product Family structure, use the following procedure.

<a id="wwID0EP35T"></a>

1. Select the product model under which you want to insert a new variant specification.

<a id="wwID0ER45T"></a>

2. Click **Insert Existing** from the **Structure** tab tool bar or the right-click actions menu on the product model. The **Insert Existing Product Family Member** window opens.

<a id="wwID0E655T"></a>

3. If available, select a variant specification type in the **Type** field. (Multiple types can be defined by the system administrator.)

<a id="wwID0EFA6T"></a>

4. Specify a name or number for the variant specification you want to insert, then click **Search**.

<a id="wwID0ELB6T"></a>

5. Select the object you want from the **Search Results** table, then click **OK**.

<a id="wwID0EGC6T"></a>

The variant specification is added as a child of the product model.

<a id="wwID0EPC6T"></a>

## Removing Variant Specification from Product Family

<a id="wwID0ETC6T"></a>

To remove an organized variant specification from the Product Family structure, select the object and click ![](../../../../../images/ae4a236e741a_IconRemove.gif) **Remove** from one of the following locations.

<a id="wwID0EYD6T"></a>

- The **Editing** actions group in the **Structure** tab tool bar.

<a id="wwID0ECF6T"></a>

- The right-click actions menu on the object.

<a id="wwID0ETC6T-6"></a>

You cannot remove a managed variant specification from the Product Family structure.

<a id="wwID0E1F6T"></a>

## Pasting Variant Specifications

<a id="wwID0E5F6T"></a>

When you create a variant specification through a save-as or copy-paste action, you can select a different variant specification type in the **Type** column of the **Paste As Copy** window. When you paste a variant specification into a Product Family, the resulting new object is stored in the same folder as the source variant specification. The option filter and manual option selections made for the source object are also copied to the new variant specification and the default part configuration specification is set.
