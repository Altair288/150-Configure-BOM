# Creating an Option Set

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsSetCreate.html)  
> 获取日期：2026-11-12

<a id="wwID0EZNIR"></a>

<a id="wwID0ENOIR"></a>

You can create an option set for a product or library from the **Option Sets** table.

<a id="wwID0EWOIR"></a>

To create an option set:

<a id="wwID0E6OIR"></a>

1. Click **Details** under a product or library information page.

<a id="wwID0EEQIR"></a>

2. Add a tab and select Customize > General > Option Sets. The **Option Sets** table shows the option sets available for the selected product or library.

<a id="wwID0EASIR"></a>

3. Click ![](../../../../../images/5b29911fa22e_IconOptionSetNew.png).

<a id="wwID0EJTIR"></a>

4. The **New Option Set** window appears. Specify the following characteristics of the option set:

<a id="wwID0ESUIR"></a>

- **Name**–Type the option set name.

<a id="wwID0EXVIR"></a>

- **Description**–(Optional) Type the description for the option set.

<a id="wwID0E3WIR"></a>

- **Allow Assignment of Exclude Choices**–Enables choice assignment and filtering such that the part is excluded rather than included in the product structure. For example, if the usage of the part is assigned Country≠USA, then when USA is selected as one of the filtering criteria in the Option filter, that part is excluded from the resulting product structure.

<a id="wwID0EBYIR"></a>

- **Allow Assignment of Expressions to Non-Configurable Items**–Controls the assignment of expressions to a product structure. If the value of this attribute is set to **No**, users can assign expressions to configurable modules and to their usage links. If it is set to **Yes**, users can assign expressions to standard (that is, non-configurable) parts as well. By default, this attribute is set to **No**.

|  |  |
| --- | --- |
| **![\*](../../../../../images/887c9a51d571_tip_16x16.png)** | It is recommended that you set the **Allow Assignment of Expressions to Non-Configurable Items** attribute to **No** if you use the AnyBOM Assembly functionality to manage configurable CAD structures. Choices assigned to standard parts are not transferred to Creo Parametric. |

<a id="wwID0EC2IR"></a>

- **Allow Date Effectivity for Choices**–Allows you to set effectivity dates for choices. The effectivity dates are taken into account during the choice assignment and filtering.

<a id="wwID0EH3IR"></a>

- **Reference Option Pool Rules Automatically**–Determines whether global rules should be inherited by the option set. If set to **Yes**, global rules are inherited and cannot be individually selected when choices are added to the option set. If set to **No**, you can selectively determine which rules should be inherited by the option set.

<a id="wwID0EU4IR"></a>

- **Manage Local Rule Changes Independently from the Option Set**–Specifies if the local rules can be revised independently of the option set. You can set it as follows:

<a id="wwID0E35IR"></a>

- If it is set to **Yes**, you can revise local rules independently of the option set. Editing and revising local rules does not iterate the option set. The system uses the configuration specification criteria (specified in the **Option Filter** tab of the **Edit Filter** user interface) to determine the revision of that local rule to use.

<a id="wwID0EKAJR"></a>

- If it is set to **No**, the local rules can be only iterated but not revised. Editing local rules iterates the option set. The system uses a specific iteration of the local rule that was defined for the option set.

|  |  |
| --- | --- |
| **![\*](../../../../../images/6652ad397dd1_note_16x16.png)** | Ability to manage local rules independently is an advanced capability and subject to a separate license entitlement. |

<a id="wwID0EMCJR"></a>

5. Click **OK**.

<a id="wwID0ESDJR"></a>

6. After you created the option set, you can start adding choices to the option set.
