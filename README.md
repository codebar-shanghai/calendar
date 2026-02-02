# Codebar Shanghai Calendar

## How to Use

There are two calendar feeds:

* For **workshops** https://codebar-shanghai.github.io/calendar/workshops.ics
* For **meetups** https://codebar-shanghai.github.io/calendar/meetups.ics

**DO NOT** download these files. Instead, **subscribe** to or **import** these URLs in your calendar app so you can receive updates in the future. Here is guidance for some calendar apps:

1. iCloud / iOS / macOS: [Add calendar subscriptions](https://support.apple.com/en-us/102301) ([中文](https://support.apple.com/zh-cn/102301))
2. Android: [Subscribe to someone else’s calendar](https://support.google.com/calendar/answer/37100) (Look for the `Add a calendar from a URL` button) ([中文](https://support.google.com/calendar/answer/37100?hl=zh-Hans))
3. Outlook: [Import or subscribe to a calendar](https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web-cff1429c-5af6-41ec-a5b4-74f2c278e98c)

## How to Update (For Organizers)

For now:

1. Clone the repo and create a new branch.
2. Edit the file [events.yml](./data/events.yml). It's better to use vscode with [YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) language server installed, to get schema validation from [events.schema.json](./events.schema.json).
3. `id`, `title`, `kind`, `start` and `end` are required.
    * For `id`, go to [Online GUID / UUID Generator](https://www.guidgenerator.com/) or [Online UUID Generator Tool](https://www.uuidgenerator.net/) to get a GUID. An `id` once assigned to an event must **NOT** be changed.
    * For `kind`, it is either `workshop` or `meetup`.
    * For `start` and `end`, use the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format, e.g. `2026-02-06T17:00:00+08:00`. It should usually end with `+08:00` for UTC+8.
4. Save, commit, push the branch, and create a new pull request. GitHub Actions will validate and publish the `.ics` files.
