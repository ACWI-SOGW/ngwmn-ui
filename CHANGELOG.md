# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Checkbox to water levels chart legend to toggle lithology layers visibility
- Added title to hydrograph
- Added triangular water level indicator to construction water level element

### Changed
- Moved Lithology Table from Well Log accordion to Well Log component
- Changed the Lithology and Well Construction table layout to better accommodate narrow viewports
- Changed appearance of Well Construction radio buttons
- Removed mini-hydrograph from construction element

## [0.2.0]
### Added
- Added basic description text
- Added keys and interactivity to well construction table with a responsive layout
- Added providers view which provides a list of available providers
- Added provider view which shows information about an individual provider
- Added sites view which provides a list of sites for a provider
- Added error template for backing service calls, 404s, and 500s
- Added hyperlink back to NGMWN Portal UI

### Changed
- The site page route was changed
- Replaced the SIFTA service with hard coded provider logos.
- Support sites that lack water level data.
- Changed location and wording of monitoring location summary

## [0.1.0]
### Added
- Added view for a site location
- Added cooperator logos to site location view
- Added summary table to location view
- Added US Web Design System and basic page layout
- Added water quality table to site location view
- Added water levels graph to site location page
- Added brush/pan chart under main chart
- Add legend to chart when there are classed points
- Line gaps drawn on gap of 6 months or more
- y-axis label set to depth to water, feet below land surface
- Added zoom behaviors to main chart
- Added lithology chart
- Added well log tables
- Added well construction drawing (screens, casings)
- Fill lithology layers with FGDC Digital Cartographic Standard patterns
- Added water level data table
- Added Statistics Section

### Changed
- Removed duplicate service call to retrieve well log data
- Using headless Firefox to run tests for CI
- Using node 10.13.0

[Unreleased]: https://github.com/ACWI-SOGW/ngwmn-ui-0.2.0...master
[0.2.0]: https://github.com/ACWI-SOGW/ngwmn-ui-0.1.0...ngwmn-ui-0.2.0
[0.1.0]: https://github.com/ACWI-SOGW/ngwmn-ui/tree/ngwmn-ui-0.1.0
