# Managing Alias Objects

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsManagingAliasObjects.html)  
> 获取日期：2026-11-12

<a id="wwID0EJHFS"></a>

<a id="wwID0E1HFS"></a>

Aliases are primary business objects:

<a id="wwID0ETIFS"></a>

- Aliases are lifecycle-managed objects.

<a id="wwID0EVJFS"></a>

- They can be iterated and revised.

<a id="wwID0EXKFS"></a>

- You can view the history of aliases.

<a id="wwID0EZLFS"></a>

- Aliases follow the change processes as other Windchill objects.

<a id="wwID0E2MFS"></a>

- You can set up access control policies for aliases.

<a id="wwID0E4NFS"></a>

- Aliases are promotable objects.

<a id="wwID0E6OFS"></a>

- You can assign date effectivity to aliases (set automatically by the change workflow or directly by the user).

<a id="wwID0ESPFS"></a>

Whenever you update an alias, the system iterates it. An alias can be revised to capture different definitions of the alias. For example, the A.1 definition of the alias PrimaryColor can be Blue or Red, while the B.1 revision of that alias can have a definition of Blue or Red or Yellow.

<a id="wwID0E3PFS"></a>

![](../../../../images/9b7a9a6c22ef_AliasRevise.png)

<a id="wwID0EJQFS"></a>

You can use configuration criteria to determine the revision of the assigned expressions and aliases to use (based on the lifecycle and date effectivity) when filtering the product structure.

<a id="wwID0ESQFS"></a>

## Defining Alias Subtypes

<a id="wwID0EWQFS"></a>

Administrators can define additional subtypes for the alias object using the **Type and Attribute Management** utility.
