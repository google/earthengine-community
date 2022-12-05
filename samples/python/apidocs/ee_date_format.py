# Copyright 2021 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START earthengine__apidocs__ee_date_format]
# Various examples of ee.Date.format with Joda-Time formatting and time zones.

date = ee.Date('2020-08-18')  # Defaults to UTC
print(date.getInfo())  # Date (2020-08-18 00:00:00)

# List of time zones:
# https://www.joda.org/joda-time/timezones.html

print(date.format(None, 'GMT').getInfo())  # 2020-08-18T00:00:00
print(date.format(None, 'Etc/GMT').getInfo())  # 2020-08-18T00:00:00
print(date.format(None, 'Etc/GMT+0').getInfo())  #  2020-08-18T00:00:00
print(date.format(None, 'Zulu').getInfo())  # 2020-08-18T00:00:00
print(date.format(None, 'UTC').getInfo())  # 2020-08-18T00:00:00

print(date.format(None, 'America/Los_Angeles').getInfo())  # 2020-08-17T17:00:00
print(date.format(None, 'US/Pacific').getInfo())  # 2020-08-17T17:00:00
print(date.format(None, 'Etc/GMT+8').getInfo())  # 2020-08-17T17:00:00
print(date.format(None, 'PST8PDT').getInfo())  # 2020-08-17T17:00:00

print(date.format(None, 'Australia/Tasmania').getInfo())  # 2020-08-18T10:00:00
print(date.format(None, 'Etc/GMT-10').getInfo())  # 2020-08-18T10:00:00

# Reference for Joda-Time format characters:
# http://joda-time.sourceforge.net/apidocs/org/joda/time/format/DateTimeFormat.html

datetime = ee.Date('1975-07-23T21:13:59')  # Defaults to UTC
print(datetime.getInfo()) # Date (1972-07-25 21:13:59)

# year of era and era
print(datetime.format('YYYY GG').getInfo())  # 1975 AD
# century and year
print(datetime.format('CC YY').getInfo())  # 19 75
# weekyear and week of weekyear
print(datetime.format('xxxx ww').getInfo())  # 1975 30

# year and day of year
print(datetime.format('yy DDD').getInfo())  # 75 204
# month of year and day of month
print(datetime.format('MM dd').getInfo())  # 07 23

# day of week number and day of week text
print(datetime.format('e E').getInfo())  # 3 Wed
print(datetime.format('e EEEEEEEE').getInfo())  # 3 Wednesday

# half of day, hour of halfday, and clockhour of halfday
print(datetime.format('a K h').getInfo())  # PM 9 9
print(datetime.format('a KK hh').getInfo())  # PM 09 09

# hour of day, clockhour of day, minute, second, fraction of second
print(datetime.format('H k m s S').getInfo())  # 21 21 13 59 0
print(datetime.format('HH kk mm ss SS').getInfo())  # 21 21 13 59 00

# time zone
print(datetime.format('z').getInfo())  # UTC
print(datetime.format('zzzz').getInfo())  # Coordinated Universal Time
print(datetime.format('z', 'PST8PDT').getInfo())  # PDT
print(datetime.format('zzzz', 'PST8PDT').getInfo())  # Pacific Daylight Time

# time zone offset/id
print(datetime.format('Z').getInfo())  # +0000
print(datetime.format('ZZ').getInfo())  # +00:00
print(datetime.format('ZZZ').getInfo())  # UTC
print(datetime.format('Z', 'PST8PDT').getInfo())  # -0700
print(datetime.format('ZZ', 'PST8PDT').getInfo())  # -07:00
print(datetime.format('ZZZ', 'PST8PDT').getInfo())  # PST8PDT

# single quotes for text
print(datetime.format("YY 'yada' MM").getInfo())  # 75 yada 07
# '' for a single quote
print(datetime.format("YY ''MM'' dd").getInfo())  # 75 '07' 23
# [END earthengine__apidocs__ee_date_format]
