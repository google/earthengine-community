# SRTM Elevation Bias in Coastal Flood Risk Assessment

Global assessments of sea level rise vulnerability have long relied on the Shuttle Radar Topography Mission (SRTM) digital elevation model — the most widely used global terrain dataset. However, SRTM contains a systematic positive bias: it measures the tops of trees and buildings rather than the ground beneath. In low-lying coastal areas, this bias [averages over 2 meters](https://pmc.ncbi.nlm.nih.gov/articles/PMC6820795/), with errors reaching nearly 4 meters in densely vegetated or urbanized zones.

The consequence is a large underestimation of risk. Studies using SRTM have historically underestimated the number of people living on land threatened by rising seas by a factor of three to four. When researchers corrected for this bias using machine learning ([CoastalDEM](https://www.nature.com/articles/s41467-019-12808-z)) and LiDAR fusion ([DeltaDTM](https://www.nature.com/articles/s41597-024-03091-9)), the population exposed to projected 2100 water levels rose from tens of millions to hundreds of millions. Much of the coastal planning built on SRTM-derived elevation data has systematically understated exposure.

## Core Technical Roots

### Radar vs. Ground Truth

SRTM data was collected in February 2000 using C-band radar interferometry from the Space Shuttle. Radar signals bounce off the "scattering center" of the landscape — which includes vegetation canopies, building roofs, and infrastructure. In forested areas, SRTM measures an elevation between the ground and the canopy top; in cities, it measures rooftops.

For coastal flood modeling, the relevant metric is bare-earth terrain elevation. SRTM's positive bias effectively lifts low-lying coastal land on digital maps, placing it above flood risk zones on paper. Validation studies comparing SRTM to high-accuracy airborne LiDAR found [mean errors](https://pmc.ncbi.nlm.nih.gov/articles/PMC6820795/) of 3.7 meters in the U.S. coastal zone and 2.5 meters in Australia within the 1–20 meter elevation band. NASA's ICESat satellite data indicates a global mean bias of 1.9 meters in the same band.

### The Population Exposure Multiplier

In 2019, Kulp and Strauss published [CoastalDEM](https://www.nature.com/articles/s41467-019-12808-z), a neural-network-corrected version of SRTM. The re-analysis of global exposure showed the extent of the previous underestimation:

*   **Current high tide exposure:** SRTM estimated 28 million people lived below the high tide line. CoastalDEM corrected this to 110 million — a nearly fourfold increase.
*   **Current annual flood exposure:** CoastalDEM estimates 250 million people currently live on land that floods annually.
*   **2100 projections:** Under a high-emissions scenario (RCP 8.5) with ice sheet instability, CoastalDEM indicates up to 630 million people could live on land below projected annual flood levels, compared to 170 million estimated using uncorrected SRTM under the same scenario.

The correction did not change sea level projections; it changed the understanding of the land's elevation.

### Geographic Concentration of Error

SRTM error is not randomly distributed. It correlates with dense vegetation (mangroves, deltas) and dense settlement (cities) — factors that concentrate vulnerable populations. Consequently, the error is highest where the population is densest.

Eight Asian nations — China, Bangladesh, India, Vietnam, Indonesia, Thailand, the Philippines, and Japan — contain [more than 70%](https://pmc.ncbi.nlm.nih.gov/articles/PMC6820795/) of the global population on land below projected 2100 high tide lines. Among these, six countries (China, Bangladesh, India, Vietnam, Indonesia, and Thailand) account for approximately [237 million people](https://www.climatecentral.org/climate-matters/new-report-triples-estimates-of-vulnerability-to-sea-level-rise) facing annual coastal flooding by 2050 — nearly quadrupling earlier estimates based on SRTM. This figure was [independently reported](https://www.cbsnews.com/news/rising-sea-levels-on-track-to-destroy-homes-of-300-million-people-by-2050/) by multiple outlets citing the same underlying research.

### Early-Stage Acceleration

Research published in 2023 using a new LiDAR-based elevation model ([GLL_DTM](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2022EF002880), developed from NASA's ICESat-2 satellite) found that the flattest, most extensive coastal areas are often at the very lowest elevations (0–1 meter). Unlike radar-based models, which suggested a gradual increase in flooded area, the LiDAR data shows the [fastest increase in exposed land occurring in the early stages](https://climateattribution.org/resources/new-lidar-based-elevation-model-shows-greatest-increase-in-global-coastal-exposure-to-flooding-to-be-caused-by-early-stage-sea-level-rise/) of sea level rise — in nearly all countries within the first 2 meters. In [one-third of countries](https://climateattribution.org/resources/new-lidar-based-elevation-model-shows-greatest-increase-in-global-coastal-exposure-to-flooding-to-be-caused-by-early-stage-sea-level-rise/), most of this increase in exposure to flooding is projected to occur within the first meter of sea level rise. This shortens the window available for adaptation.

## Social and Planning Implications

### Planning on Overstated Elevation

For two decades, coastal planners, engineers, and insurers used SRTM-derived data. Vulnerability maps and adaptation plans developed during this period inherited SRTM's bias. When a planning document shows a neighborhood "above" projected flood levels based on SRTM, it may actually be meters lower. Decisions about property, infrastructure, and zoning have been made on [elevation data that systematically understated exposure](https://www.frontiersin.org/journals/earth-science/articles/10.3389/feart.2016.00036/full). That study found SRTM underpredicts U.S. population exposure by more than 60% at 3 meters elevation, with the underestimation becoming near-universal at 10 meters.

### The Sub-Meter Problem

Researchers have [concluded](https://www.frontiersin.org/journals/earth-science/articles/10.3389/feart.2018.00230/full) that current global DEMs are not adequate for high-confidence mapping of exposure to fine increments (<1 m) of sea level rise. While newer models like [DeltaDTM](https://www.nature.com/articles/s41597-024-03091-9) (2024) have reduced mean absolute error to 0.45 meters (with a bias of 0.01 m and RMSE of 0.74 m across all land cover classes), this still falls short of the precision required for neighborhood-level planning. High-confidence assessment requires airborne LiDAR, which remains expensive for many developing nations — creating a gap where the most vulnerable populations have the least accurate maps.

### Wetland Mapping Limitations

Coastal wetlands provide flood protection but are difficult to map accurately. Even corrected datasets struggle to penetrate dense marsh vegetation. A study of LiDAR-derived salt marsh DEMs found [systematic positive bias](https://www.sciencedirect.com/science/article/abs/pii/S0034425712000557) ranging from 0.03 to 0.25 meters depending on vegetation cover class, with overall mean error of 0.10 m. Applying neural-network-based correction factors [substantially improved accuracy](https://www.researchgate.net/publication/311512744_Vegetation_Bias_Correction_in_Tidal_Salt_Marsh_LiDAR_Data_Sets_with_Artificial_Neural_Networks), but elevation differences of less than 10 cm can affect plant distributions and marsh productivity. If models overstate wetland elevation, they understate how often wetlands are inundated and how likely they are to be lost, obscuring the condition of natural barriers protecting coastal residents.

### The Correction Lag

While improved datasets — CoastalDEM (2019), GLL_DTM (2023), DeltaDTM (2024) — now exist, the installed base of SRTM-derived products remains large. Older assessments continue to be cited in policy documents, propagating the original bias. The scientific correction has arrived, but its integration into planning practice lags behind.
