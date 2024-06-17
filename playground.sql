select * from public."ZipCode" limit 10

select * from public."VendorUser"

select * from public."Schedule"

select * from public."VendorProfile"

select * from public."PitStopAddress"

select count("zipCode") from public."ZipCode" where county = (select county from public."ZipCode" where "zipCode" = '95111')

select "zipCode" from public."ZipCode" where county = (select county from public."ZipCode" where "zipCode" = '56245')  limit 10 offset 1



update public."Schedule" set dayOfWeek= array_append("dayOfWeek", 0)

SELECT * FROM pg_timezone_names;

show timezone

SET timezone TO 'UTC'