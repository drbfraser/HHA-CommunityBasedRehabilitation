# Production CloudWatch Alarm Notification Guide

This guide is for setting up **production email notifications** for the CBR app using **AWS CloudWatch Alarms** and **Amazon SNS**.

## What This Setup Does

CloudWatch watches the production server logs, site health, and server metrics. When something serious happens, CloudWatch sends an alert to SNS. SNS then sends an email to the people subscribed to the alert topic.

The production setup should alert the team when:

- The production website appears to be unreachable.
- Django returns repeated HTTP 500 errors.
- Django has repeated unhandled exceptions.
- CPU usage stays high.

## Important Production Values

Use these exact names for production unless the AWS account already uses a different naming convention.

| Item | Production value |
| --- | --- |
| CloudWatch log group prefix | `cbr-prod` |
| SNS alert topic | `CBR-Production-Alerts` |
| Django log group | `cbr-prod/logs/cbr_django` |
| Caddy access log group | `cbr-prod/logs/caddy/access.log` |
| Log metric namespace | `cbr/production` |
| Server metric namespace | `cbr-prod/metrics` |
| Website URL | `https://cbr.hopehealthaction.org` |
| Canary name | `cbr-production-site-health` |

Use the same AWS region for CloudWatch Logs, CloudWatch Alarms, CloudWatch Synthetics, and SNS. If you are not sure which region is correct, look for the region where the `cbr-prod` log groups already exist.

## Before You Start

You need:

- Access to the AWS Console.
- Permission to use CloudWatch Logs.
- Permission to create CloudWatch metric filters.
- Permission to create CloudWatch alarms.
- Permission to create CloudWatch Synthetics canaries.
- Permission to create SNS topics and email subscriptions.
- The email address or mailing list that should receive production alerts.

Do not continue with alarm creation until you have confirmed that production logs are already reaching CloudWatch.

## Step 1: Confirm Production Logs and Metrics Exist

1. Sign in to the AWS Console.
2. Open **CloudWatch**.
3. Make sure you are in the correct AWS region.
4. In the left menu, choose **Logs**.
5. Choose **Log groups**.
6. Search for `cbr-prod`.
7. Confirm that these log groups exist:
   - `cbr-prod/logs/cbr_django`
   - `cbr-prod/logs/caddy/access.log`
8. Open `cbr-prod/logs/cbr_django`.
9. Open the newest log stream.
10. Confirm that recent log events are visible.
11. Go to **Metrics > All metrics**.
12. Confirm that the `cbr-prod/metrics` namespace has the `cpu_p` metric.

If you do not see any `cbr-prod` log groups or metrics, stop here. The server may not be sending production logs or metrics to CloudWatch yet.

## Step 2: Create the Production Email Topic

SNS is the AWS service that sends the email notifications.

1. Open **Amazon SNS** in the AWS Console.
2. Make sure you are in the same AWS region where the `cbr-prod` logs exist.
3. In the left menu, choose **Topics**.
4. Choose **Create topic**.
5. For **Type**, choose **Standard**.
6. For **Name**, enter:

   ```txt
   CBR-Production-Alerts
   ```

7. Choose **Create topic**.
8. Open the new topic.
9. Choose **Create subscription**.
10. For **Protocol**, choose **Email**.
11. For **Endpoint**, enter the email address or mailing list that should receive alerts.
12. Choose **Create subscription**.
13. Check the email inbox for a confirmation email from AWS.
14. Open the email and choose **Confirm subscription**.

Important: AWS will not send alert emails until the subscription is confirmed.

## Step 3: Create an Alarm for Django 5xx Errors

This alarm catches repeated Django server errors.

### Create the Metric Filter

1. Open **CloudWatch**.
2. Go to **Logs > Log groups**.
3. Open:

   ```txt
   cbr-prod/logs/cbr_django
   ```

4. Choose **Metric filters**.
5. Choose **Create metric filter**.
6. Use a filter pattern that matches Django 5xx log events.
7. Choose **Next**.
8. For **Filter name**, enter:

   ```txt
   CBRProductionDjango5xxErrors
   ```

9. For **Metric namespace**, enter:

   ```txt
   cbr/production
   ```

10. For **Metric name**, enter:

    ```txt
    Django5xxCount
    ```

11. For **Metric value**, enter:

    ```txt
    1
    ```

12. If CloudWatch shows **Default value**, enter:

    ```txt
    0
    ```

13. Create the metric filter.

### Create the Alarm

Use these alarm settings:

| Setting | Value |
| --- | --- |
| Metric | `Django5xxCount` |
| Namespace | `cbr/production` |
| Statistic | `Sum` |
| Period | `5 minutes` |
| Threshold | `Greater/Equal 3` |
| Evaluation periods | `1` |
| Datapoints to alarm | `1` |
| Missing data | Treat missing data as `not breaching` |
| SNS topic | `CBR-Production-Alerts` |
| Alarm name | `CBR Production Django 5xx Errors` |

This means the team gets an email if production Django logs contain 3 or more HTTP 500 error events within 5 minutes.

## Step 4: Create an Alarm for Django Unhandled Exceptions

This alarm catches repeated unhandled exceptions and traceback events.

### Create the Metric Filter

1. Open **CloudWatch**.
2. Go to **Logs > Log groups**.
3. Open:

   ```txt
   cbr-prod/logs/cbr_django
   ```

4. Choose **Metric filters**.
5. Choose **Create metric filter**.
6. Use a filter pattern that matches Django traceback or unhandled exception events.
7. Choose **Next**.
8. For **Filter name**, enter:

   ```txt
   CBRProductionDjangoUnhandledExceptions
   ```

9. For **Metric namespace**, enter:

   ```txt
   cbr/production
   ```

10. For **Metric name**, enter:

    ```txt
    DjangoUnhandledExceptionCount
    ```

11. For **Metric value**, enter:

    ```txt
    1
    ```

12. If CloudWatch shows **Default value**, enter:

    ```txt
    0
    ```

13. Create the metric filter.

### Create the Alarm

Use these alarm settings:

| Setting | Value |
| --- | --- |
| Metric | `DjangoUnhandledExceptionCount` |
| Namespace | `cbr/production` |
| Statistic | `Sum` |
| Period | `5 minutes` |
| Threshold | `Greater/Equal 3` |
| Evaluation periods | `1` |
| Datapoints to alarm | `1` |
| Missing data | Treat missing data as `not breaching` |
| SNS topic | `CBR-Production-Alerts` |
| Alarm name | `CBR Production Django Unhandled Exceptions` |

This means the team gets an email if production Django logs contain 3 or more traceback exception events within 5 minutes.

## Step 5: Create a Website Unreachable Alarm

Do not rely only on access logs to decide whether the site is down. A quiet website may have no access logs even when it is healthy.

The production setup should use a **CloudWatch Synthetics canary**. A canary is a scheduled check that visits the website like a simple user.

1. Open **CloudWatch**.
2. In the left menu, choose **Application Signals**.
3. Choose **Synthetics Canaries**.
4. Choose **Create canary**.
5. Choose a simple heartbeat or URL check blueprint.
6. For canary name, enter:

   ```txt
   cbr-production-site-health
   ```

7. For the URL, enter:

   ```txt
   https://cbr.hopehealthaction.org
   ```

8. Create the canary.

If the canary setup creates an alarm automatically, edit the alarm so it sends notifications to:

```txt
CBR-Production-Alerts
```

Use these alarm settings:

| Setting | Value |
| --- | --- |
| Metric | `SuccessPercent` |
| Namespace | `CloudWatchSynthetics` |
| Dimension | `CanaryName = cbr-production-site-health` |
| Statistic | `Average` |
| Period | `1 day` |
| Threshold | `Less than 100` |
| Evaluation periods | `1` |
| Datapoints to alarm | `1` |
| Missing data | Treat missing data as `missing` |
| SNS topic | `CBR-Production-Alerts` |
| Alarm name | `cbr-production-site-unreachable-canary` |

This means the team gets an email if the production canary reports less than 100% success for the day.

## Step 6: Create a High CPU Alarm

This alarm depends on the `cpu_p` metric being visible in CloudWatch.

1. Open **CloudWatch**.
2. Go to **Metrics**.
3. Choose **All metrics**.
4. Open the namespace:

   ```txt
   cbr-prod/metrics
   ```

5. Choose the metric:

   ```txt
   cpu_p
   ```

6. Create an alarm from the metric.

Use these alarm settings:

| Setting | Value |
| --- | --- |
| Metric | `cpu_p` |
| Namespace | `cbr-prod/metrics` |
| Statistic | `Average` |
| Period | `1 minute` |
| Threshold | `Greater than 85` |
| Evaluation periods | `5` |
| Datapoints to alarm | `5` |
| Missing data | Treat missing data as `not breaching` |
| SNS topic | `CBR-Production-Alerts` |
| Alarm name | `CBR Production High CPU Usage` |

This means the team gets an email if production CPU usage stays above 85% for 5 consecutive minutes.

## Step 7: Test the Notification Path

Testing is important. The setup is not complete until a real email has been received.

1. Open **CloudWatch**.
2. Choose **Alarms**.
3. Open one of the new production alarms.
4. Check that the alarm action points to:

   ```txt
   CBR-Production-Alerts
   ```

5. If AWS allows manual alarm state changes, temporarily set the alarm state to **In alarm**.
6. Confirm that an email arrives.
7. Return the alarm to normal monitoring.
8. Open the alarm's **History** tab.
9. Confirm that CloudWatch recorded the notification action.

If no email arrives:

- Confirm the SNS email subscription was accepted.
- Confirm the alarm uses the correct SNS topic.
- Confirm the SNS topic and CloudWatch alarm are in the same AWS region.
- Check spam or junk mail.
- Try sending a test message from the SNS topic.

## Recommended Final Alarm List

After setup, production should have these alarms:

| Alarm name | Purpose |
| --- | --- |
| `CBR Production Django 5xx Errors` | Finds repeated Django server error responses |
| `CBR Production Django Unhandled Exceptions` | Finds repeated traceback exception events |
| `cbr-production-site-unreachable-canary` | Checks whether the production site is reachable |
| `CBR Production High CPU Usage` | Finds sustained high CPU usage |

## Suggested Alert Thresholds

These values match the CloudWatch alarm configuration, adapted for production.

| Problem | Starting threshold |
| --- | --- |
| Django 5xx errors | 3 or more in 5 minutes |
| Django unhandled exceptions | 3 or more in 5 minutes |
| Website unreachable | Success percent less than 100 over 1 day |
| High CPU usage | Greater than 85% for 5 consecutive minutes |

## AWS Documentation

These AWS pages explain the services used in this guide:

- CloudWatch metric filters: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CreateMetricFilterProcedure.html
- CloudWatch alarms: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Alarms.html
- CloudWatch missing data settings: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarms-and-missing-data.html
- SNS email notifications: https://docs.aws.amazon.com/sns/latest/dg/sns-email-notifications.html
- CloudWatch Synthetics canaries: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Create.html
