# Understanding How Logic Elements Are Evaluated

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVUnderstLogicElemEval.html)  
> 获取日期：2026-11-12

<a id="wwID0EXGIT"></a>

<a id="wwID0EHHIT"></a>

When you design and implement a configurable product structure, it is helpful to understand how the system evaluates logic elements. This section provides an overview of the evaluation process. The logic elements used by the system are divided into two fundamental categories – constraints and parameters. The system processes the logic elements for a particular product structure using the following procedure:

<a id="wwID0EAIIT"></a>

1. The parameters and constraints for the product structure are loaded into the system from the configurable modules of the structure.

<a id="wwID0ECJIT"></a>

2. The system determines the input parameters that need to be displayed to the user in the Set Parameters page of the **Configure** window. By default, all input parameters for the topmost configurable module are processed first.

<a id="wwID0ELKIT"></a>

1. If at least one page break has been defined for the topmost configurable module, then only the input parameters for the first page of this configurable module are processed.

<a id="wwID0ENLIT"></a>

1. If the topmost configurable module does not contain any input parameters, the system automatically selects another configurable module by examining the logic of the product structure and processes its input parameters. However, if the selected configurable module has a page break defined, then only those input parameters for the first page are processed.

<a id="wwID0EPMIT"></a>

1. If a child resolution has been defined, the system processes the input parameters for the identified child configurable module. The processing of input parameters for the child configurable module also respects any child resolution or page breaks defined on the child configurable module.

<a id="wwID0ESNIT"></a>

3. Any constraints that are applicable to the identified input parameters are applied, which may reduce or eliminate the values that are permissible for each input parameter.

<a id="wwID0EDOIT"></a>

1. For example, if you have a parameter that includes 1,2,3,4, and 5 as valid values and a case table that only allows values of 1,2,3 or 4 for the same parameter, the parameter’s list of permissible values is reduced to only include 1,2,3 or 4.

<a id="wwID0EYOIT"></a>

4. The identified input parameters are displayed in the Set Parameters page of the **Configure** window. The page also includes:

<a id="wwID0EBQIT"></a>

- Images that are relevant to a parameter

<a id="wwID0EDRIT"></a>

- Page titles that have been defined

<a id="wwID0EFSIT"></a>

- Images that are relevant to the current page

<a id="wwID0EHTIT"></a>

- Custom help pages that are relevant to the current page

<a id="wwID0EKUIT"></a>

5. After you select **Next**, the system processes all values on the current page.

|  |  |
| --- | --- |
| **![\*](../../../../../images/6652ad397dd1_note_16x16.png)** | The order of the parameters on a particular input page is not relevant because the system processes input parameters on a page-by-page basis, not on a parameter-by-parameter basis. Therefore, you should arrange the parameters on an input page in an order that will be clearly understood by the users who will be providing inputs. |

<a id="wwID0EKWIT"></a>

6. In some cases, the system automatically skips one or more pages of inapplicable input parameters based on the values you entered or selected.

<a id="wwID0E2WIT"></a>

1. For example, consider a product structure of configurable modules that includes two parameters, P1 and P2, with a page break in-between, so that P1 is displayed on Page 1 and P2 would is on Page 2. If a case table is also defined so that if P1=5, then P2 can only be 3 and the UI property (hide when driven) for P2 is set to true. If you select 5 for P1, then Page 2, and P2, would be skipped because the value for P2 has been automatically set to 3 and the system was instructed to skip (or hide) this parameter if its value had been driven or set.

<a id="wwID0EZXIT"></a>

7. After the system has identified values for all required input parameters, you can review your inputs in the Review Inputs page before proceeding to the Variant Solution page.
