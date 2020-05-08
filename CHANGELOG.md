# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased][]

## [0.13.0][]
### Changed
-   Renamed NWNA logo to work correctly in UI
-   Added logo for NDEE to image folder
-   Added logo for CADWR to image folder

## [0.12.0][]
### Changed
-   Removed mentions of OWI and ACWI

## [0.11.0][]
### Added
-   Added logo for NWNA and link to match logo with NWNA sites 
-   Added logo for SRWMA and link to match logo with SRWMA sites
-   Added link to provider page from provider logo on site page

## [0.10.0][]
-   Updated statistics-methods page to use provider url.

## [0.9.0][]
-   Added stats method page and a link to it from the site pages waterlevel stats accordion.
-   Added a link to the stats methods wiki in confluence.
-   Added "--" in place of null/empty values in the overall and monthly stats tables.
-   Monthly stats table headings are always displayed even if there is no monthly data.

## [0.8.0][]
-   Added new config variable STATS_SERVICE_ROOT to distinguish between the base NGWMN service and
the statistics service.

## [0.7.0][]
### Fixed
-   Updated the statistics service URL to match recently created public mapping.

## [0.6.0][]
### Added
-   Added borehole rendering, especially useful for sites w/o construction information
-   Added y axes to well diagram for depth and elevation

### Fixed
-   Added 'utf-8' decoding parameter to open method for lithology parser to prevent failure during Jenkins build
-   Fixed (swapped) column header labels for Min/Max overall water level.
-   Fixed median monthly values url

### Changed
-   Changed pagination to include start and end points

### Fixed
-   Added 'utf-8' decoding parameter to open method for lithology parser to prevent failure during Jenkins build
-   Fixed issue preventing auto refresh on save when set to watch
-   Altered numerous USWDS related class names to maintain compatibility with USWDS 2.0.0 Beta 6

## [0.5.0][]
### Added
-   Added FLDEP Logo to images/provider_logos
-   Added visualization of to the well diagram of elements that have zero total length

## [0.4.0][]
### Added
-   Added Median Monthly Statistical Water Levels section

### Fixed
-   Fixed issue with 'nested' monitoring locations showing incorrect data

### Changed
-   Moved elevation, latitude, and longitude from well log section to the summary section and removed the well log section.

## [0.3.0][]
### Added
-   Checkbox to water levels chart legend to toggle lithology layers visibility
-   Added title to hydrograph
-   Added triangular water level indicator to construction water level element

### Changed
-   Moved Lithology Table from Well Log accordion to Well Log component
-   Changed the Lithology and Well Construction table layout to better accommodate narrow viewports
-   Changed appearance of Well Construction radio buttons
-   Removed mini-hydrograph from construction element
-   Fixed issue preventing tests from running successfully in random order

## [0.2.0][]
### Added
-   Added basic description text
-   Added keys and interactivity to well construction table with a responsive layout
-   Added providers view which provides a list of available providers
-   Added provider view which shows information about an individual provider
-   Added sites view which provides a list of sites for a provider
-   Added error template for backing service calls, 404s, and 500s
-   Added hyperlink back to NGMWN Portal UI

### Changed
-   The site page route was changed
-   Replaced the SIFTA service with hard coded provider logos.
-   Support sites that lack water level data.
-   Changed location and wording of monitoring location summary

## [0.1.0][]
### Added
-   Added view for a site location
-   Added cooperator logos to site location view
-   Added summary table to location view
-   Added US Web Design System and basic page layout
-   Added water quality table to site location view
-   Added water levels graph to site location page
-   Added brush/pan chart under main chart
-   Add legend to chart when there are classed points
-   Line gaps drawn on gap of 6 months or more
-   y-axis label set to depth to water, feet below land surface
-   Added zoom behaviors to main chart
-   Added lithology chart
-   Added well log tables
-   Added well construction drawing (screens, casings)
-   Fill lithology layers with FGDC Digital Cartographic Standard patterns
-   Added water level data table
-   Added Statistics Section

### Changed
-   Removed duplicate service call to retrieve well log data
-   Using headless Firefox to run tests for CI
-   Using node 10.13.0

[Unreleased]: https://github.com/ACWI-SOGW/ngwmn-ui/compare/ngwmn-ui-0.12.0...master
[0.12.0]: https://github.com/ACWI-SOGW/ngwmn-ui/compare/ngwmn-ui-0.11.0...ngwmn-ui-0.12.0
[0.11.0]: https://github.com/ACWI-SOGW/ngwmn-ui/compare/ngwmn-ui-0.10.0...ngwmn-ui-0.11.0
[0.10.0]: https://github.com/ACWI-SOGW/ngwmn-ui/compare/ngwmn-ui-0.9.0...ngwmn-ui-0.10.0
[0.9.0]: https://github.com/ACWI-SOGW/ngwmn-ui/compare/ngwmn-ui-0.8.0...ngwmn-ui-0.9.0
[0.8.0]: https://github.com/ACWI-SOGW/ngwmn-ui/compare/ngwmn-ui-0.7.0...ngwmn-ui-0.8.0
[0.7.0]: https://github.com/ACWI-SOGW/ngwmn-ui/compare/ngwmn-ui-0.6.0...ngwmn-ui-0.7.0
[0.6.0]: https://github.com/ACWI-SOGW/ngwmn-ui/compare/ngwmn-ui-0.5.0...ngwmn-ui-0.6.0
[0.5.0]: https://github.com/ACWI-SOGW/ngwmn-ui/compare/ngwmn-ui-0.4.0...ngwmn-ui-0.5.0
[0.4.0]: https://github.com/ACWI-SOGW/ngwmn-ui/compare/ngwmn-ui-0.3.0...ngwmn-ui-0.4.0
[0.3.0]: https://github.com/ACWI-SOGW/ngwmn-ui/compare/ngwmn-ui-0.2.0...ngwmn-ui-0.3.0
[0.2.0]: https://github.com/ACWI-SOGW/ngwmn-ui/compare/ngwmn-ui-0.1.0...ngwmn-ui-0.2.0
[0.1.0]: https://github.com/ACWI-SOGW/ngwmn-ui/tree/ngwmn-ui-0.1.0
