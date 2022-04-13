-- Snowflake syntax
create or replace view DIM_DATE_NEW as (
    with comparison_date as (
        select
            case
                when weekofyear(current_date()) = 53
                then 52
                else weekofyear(current_date())
            end as comp_week
            , date as comp_date
            from "FIVETRAN_DATABASE"."PUBLIC"."DIM_DATE"
            where year(comp_date) = year(current_date()) - 1
            and weekofyear(comp_date) = comp_week
            and dayofweek(comp_date) = dayofweek(current_date())
    )
    select distinct
        d.date
        , case
            when weekofyear(date) = weekofyear(current_date())
            and date - current_date() <= 0
            and date - current_date() >= -6
            then 1
            else 0
        end as WTD
        , case
            when weekofyear(date) = weekofyear(c.comp_date)
            and date - c.comp_date <= 0
            and date - c.comp_date >= -6
            then 1
            else 0
        end as WTD_PREV_YR
        , CASE
            WHEN MONTH(DATE) = MONTH(CURRENT_DATE())
            AND DAYOFYEAR(DATE) <= DAYOFYEAR(CURRENT_DATE())
            AND YEAR(DATE) = YEAR(CURRENT_DATE())
            THEN 1
            ELSE 0
        END AS MTD
        , CASE
            WHEN MONTH(DATE) = MONTH(CURRENT_DATE())
            AND DAYOFYEAR(DATE) <= DAYOFYEAR(CURRENT_DATE())
            AND YEAR(DATE) = YEAR(CURRENT_DATE()) - 1
            THEN 1
            ELSE 0
        END AS MTD_PREV_YR
        , CASE
            WHEN DAYOFYEAR(DATE) <= DAYOFYEAR(CURRENT_DATE())
            AND YEAR(DATE) = YEAR(CURRENT_DATE())
            THEN 1
            ELSE 0
        END AS YTD
        , CASE
            WHEN DAYOFYEAR(DATE) <= DAYOFYEAR(CURRENT_DATE())
            AND YEAR(DATE) = YEAR(CURRENT_DATE()) - 1
            THEN 1
            ELSE 0
        END AS YTD_PREV_YR
    from "FIVETRAN_DATABASE"."PUBLIC"."DIM_DATE" as d
    join comparison_date as c on 1=1
    order by date desc
);