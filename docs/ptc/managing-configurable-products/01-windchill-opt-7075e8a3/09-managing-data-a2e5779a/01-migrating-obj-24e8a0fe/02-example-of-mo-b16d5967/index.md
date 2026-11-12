# Example of Moving Option Sets After Migration

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsExampleOptionSetMove.html)  
> 获取日期：2026-11-12

<a id="wwID0EVEWS"></a>

<a id="wwID0EGFWS"></a>

The following example illustrates the outcome of moving two option sets created in the Site context to two different libraries.

<a id="wwID0ELFWS"></a>

This example involves two Windchill navigation filter templates NFT1 and NFT2.

<a id="wwID0EEGWS"></a>

- Option set NFT1

<a id="wwID0EJHWS"></a>

- Red (Color)

<a id="wwID0ELIWS"></a>

- Green (Color)

<a id="wwID0ENJWS"></a>

- Blue (Color)

<a id="wwID0EPKWS"></a>

- Small (Size)

<a id="wwID0ERLWS"></a>

- Medium (Size)

<a id="wwID0ETMWS"></a>

- Large (Size)

<a id="wwID0EWNWS"></a>

- Option set NFT2

<a id="wwID0E2OWS"></a>

- Orange (Color)

<a id="wwID0E4PWS"></a>

- Purple (Color)

<a id="wwID0E6QWS"></a>

- Cheap (Cost)

<a id="wwID0EBSWS"></a>

- Expensive (Cost)

<a id="wwID0EVSWS"></a>

Imagine that you first move the option set NFT1 to Library1, and then you move NFT2 to Library2. The libraries will then contain the following objects:

<a id="wwID0EOTWS"></a>

- Library1 will contain the option set NFT1 with the following options and choices:

<a id="wwID0ETUWS"></a>

- Option Color

<a id="wwID0EYVWS"></a>

- Choice Red

<a id="wwID0E1WWS"></a>

- Choice Green

<a id="wwID0E3XWS"></a>

- Choice Blue

<a id="wwID0E5YWS"></a>

- Choice Orange

<a id="wwID0EA1WS"></a>

- Choice Purple

<a id="wwID0EH2WS"></a>

- Option Size

<a id="wwID0EM3WS"></a>

- Choice Small

<a id="wwID0EO4WS"></a>

- Choice Medium

<a id="wwID0EQ5WS"></a>

- Choice Large

<a id="wwID0EU6WS"></a>

- Library2 will then contain the option set NFT2 with the following options and choices:

<a id="wwID0EZAXS"></a>

- Option Cost

<a id="wwID0E5BXS"></a>

- Choice Cheap

<a id="wwID0EUCXS"></a>

- Choice Expensive

<a id="wwID0EIDXS"></a>

Notice that the Color option and all of its choices are moved to Library1. Now if the user moved NFT2 first and then moved NFT1 second, the results would be:

<a id="wwID0EBEXS"></a>

- Library2 will contain the option set NFT2 with the following options and choices:

<a id="wwID0EGFXS"></a>

- Option Color

<a id="wwID0ELGXS"></a>

- Choice Red

<a id="wwID0ENHXS"></a>

- Choice Green

<a id="wwID0EPIXS"></a>

- Choice Blue

<a id="wwID0ERJXS"></a>

- Choice Orange

<a id="wwID0ETKXS"></a>

- Choice Purple

<a id="wwID0EWLXS"></a>

- Option Cost

<a id="wwID0E2MXS"></a>

- Choice Cheap

<a id="wwID0E4NXS"></a>

- Choice Expensive

<a id="wwID0EBPXS"></a>

- Library1 will contain the option set NFT1 with the following options and choices:

<a id="wwID0EGQXS"></a>

- Option Size

<a id="wwID0ELRXS"></a>

- Choice Small

<a id="wwID0ENSXS"></a>

- Choice Medium

<a id="wwID0EPTXS"></a>

- Choice Large

<a id="wwID0EEUXS"></a>

Notice that now Library2 has the Color option and all of its choices.
