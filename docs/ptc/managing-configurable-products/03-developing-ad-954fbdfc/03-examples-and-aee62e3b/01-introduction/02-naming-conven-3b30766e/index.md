# Naming Conventions for Parameters and Constraints

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVNamConvForParamAndConstr.html)  
> 获取日期：2026-11-12

<a id="wwID0E5YIT"></a>

<a id="wwID0EOZIT"></a>

When you create parameters and constraint logic elements, it is a good practice to establish a naming convention to facilitate working with configurable module structures. A naming convention is helpful when multiple users work with these capabilities, or if you expect to maintain a configurable module structure for an extensive period of time.

<a id="wwID0ETZIT"></a>

Consider the following examples:

| Logic Element | Usage | Naming Convention | Examples |
| --- | --- | --- | --- |
| Input Parameter | Obtains information from the user. | Preface an appropriate name with ask. | askName askOption |
| Boolean Parameter | Is applied on the usage link between a configurable module and a child part to enable or disable the usage of the child part. In the Part Structure Browser, the usage link is the Inclusion Option field displayed in the **Uses** tab. | Preface an appropriate name with use. | useOption1 useOption2 |
| Case Table Constraint | Selects a value or set of values based on a set of inputs. | Preface an appropriate name with pick. | pickColor pickSize |
| Constraint | Sets a parameter to a particular value based on a condition or conditions. | Preface an appropriate name with set. | setColor setName |
| Reference Constraint | Establishes a reference between two parameters, which results in the value of one parameter being also used for another parameter. | Preface an appropriate name with ref. | refSize refWeight |
