import { Form, List, ActionPanel, Action, showToast, Toast, useNavigation } from "@raycast/api";
import dayjs from "dayjs";

export default function main() {
  const { push } = useNavigation();

  function timeConverter(time: string) {

    var number = new Number(time)

    if (!time || time === "now") {
      push(ResultList(formatTime(new Date().toString())));
    } else {
      if (!Number.isNaN(number.valueOf())) {
        push(ResultList(formatTime(new Date(number.valueOf()).toString())))
      } else {
        const dTime = dayjs(time);
        if (dTime.isValid()) {
          push(ResultList(formatTime(time)));
        } else {
          showToast({
            style: Toast.Style.Failure,
            title: "An error occurred",
            message: "This is not a time format.",
          });
        }
      }
    }
  }

  function formatTime(time: string) {
    const dOTime = dayjs(time)
    const dTime = dayjs(time).toDate()

    var month = dOTime.month() < 10 ? "0" + (dOTime.month() + 1) : dOTime.month() + 1
    var day = dOTime.date() < 10 ? "0" + dOTime.date() : dOTime.date()
    var hour = dOTime.hour() < 10 ? "0" + dOTime.hour() : dOTime.hour()
    var min = dOTime.minute() < 10 ? "0" + dOTime.minute() : dOTime.minute()

    var sec = dOTime.second() < 10 ? "0" + dOTime.second() : dOTime.second()
    return [
      dTime.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
      dOTime.format("YYYY-MM-DD hh:mm:ss").toString(),
      dOTime.format().toString(),
      dTime.valueOf().toString(),
      dOTime.unix().toString(),
    ];
  }

  function ResultList(times: string[]) {
    return (
      <List>
        {times.map((time, index) => (
          <List.Item key={index} title={time.toString()} actions={<Actions item={{ content: time }} />}></List.Item>
        ))}
      </List>
    );
  }

  type ActionItem = {
    item: {
      content: string;
    };
  };

  function Actions({ item }: ActionItem) {
    return (
      <ActionPanel>
        <Action.CopyToClipboard content={item.content} />
        <Action.Paste content={item.content} />
      </ActionPanel>
    );
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit Form" onSubmit={(values) => timeConverter(values.time)} />
        </ActionPanel>
      }
    >
      <Form.TextField id="time" defaultValue="now" placeholder="Enter timestamp, datetime string ' YYYY-MM-dd HH:mm:ss', or 'now'." />
    </Form>
  );
}