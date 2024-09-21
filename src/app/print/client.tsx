"use client"

import { Task } from "@/types/Task"
import spc from "@/utils/pdfStyle"
import { Document, PDFViewer, View, Font, Image } from "@react-pdf/renderer"
import { Fragment } from "react"

Font.register({ family: "SF Pro", fonts: [{ src: "/SF-Pro.ttf" }] })
Font.register({ family: "SF Pro Display", fonts: [{ src: "/SF-Pro-Display-Bold.ttf", fontWeight: 700 }] })
Font.register({ family: "SF Mono", fonts: [{ src: "/SF-Mono-Regular.ttf" }] })

const TaskWrapper = spc.View`
  width: 50%;
  padding: 5mm 0pt 5mm 5mm;
  height: 25%;
  font-size: 12pt;
  position: relative;
`

const Grow = spc.View`
  flex-grow: 1;
`

const Row = spc.View`
  display: flex;
  flex-direction: row;
`

const PH1 = spc.Text`
  font-family: SF Pro Display;
  font-weight: 700;
  font-size: 16pt;
`

const P = spc.Text`
  font-size: 11pt;
  line-height: 1.2;
`

const Goal = spc.Text`
  font-family: SF Mono;
  font-size: 8pt;
  margin-top: 4pt;
  letter-spacing: -0.1pt;
  line-height: 1.3;
`

const Watermark = spc.Text`
  font-family: SF Mono;
  font-size: 6pt;
  letter-spacing: -0.03pt;
  position: absolute;
  bottom: 4pt;
  right: 5mm;
  font-variant-numeric: oldstyle-nums;
`

const PH2 = spc.Text`
  font-family: SF Pro Display;
  font-weight: 700;
  font-size: 12pt;
`

const Description = spc.Text`
  font-family: SF Mono;
  font-size: 8pt;
  line-height: 1.4;
  letter-spacing: -0.1pt;
`

const TaskSection = ({ task }: { task: Task & { playerCode: string; setupCode: string } }) => {
  return (
    <TaskWrapper>
      <Row style={{}}>
        <View style={{ width: 0, flexGrow: 1, paddingRight: 20 }}>
          <PH1 style={{ marginBottom: 6 }}>{task.name}</PH1>
          <P>{task.description}</P>
        </View>
        <View style={{ width: 110, flexShrink: 0, marginTop: -10 }}>
          <Image src={task.playerCode} style={{ width: 110, height: 110 }} />
          <Goal style={{ textAlign: "center", textTransform: "uppercase", marginTop: -4 }}>Track your points</Goal>
        </View>
      </Row>
      <Grow />
      <View style={{ paddingRight: 10 }}>
        <Goal style={{ textTransform: "uppercase", marginBottom: 4, letterSpacing: "0.5pt" }}>Goals</Goal>
        {task?.goals
          ?.sort((a, b) => b.points - a.points)
          ?.map((goal) => (
            <View key={goal.id}>
              <Goal>{goal.description}</Goal>
            </View>
          ))}
      </View>
      <Watermark>s&times;30</Watermark>
    </TaskWrapper>
  )
}

const InfoSection = ({ setupCode }: { setupCode: string }) => (
  <TaskWrapper>
    <Row style={{ height: "100%" }}>
      <View style={{ width: 0, flexGrow: 1 }}>
        <PH2 style={{ marginBottom: 8 }}>Welcome to Meet &amp; Mischief</PH2>
        <Description style={{ marginBottom: 4 }}>
          Complete your secret task without getting caught, and try to guess others’ tasks. Meet new people and earn
          prizes!
        </Description>
        <Grow />
        <Description style={{ marginBottom: 4 }}>
          Your task is on the other side of this card, along with a QR code to track your points on your phone.
        </Description>
        <Description>Happy mingling!</Description>
      </View>
      <View style={{ width: 110, flexShrink: 0, marginTop: -8 }}>
        <Image src={setupCode} style={{ width: 110, height: 110 }} />
        <Goal style={{ textAlign: "center", textTransform: "uppercase", marginTop: -4 }}>Admin Use</Goal>
      </View>
    </Row>
    <Watermark>s&times;30</Watermark>
  </TaskWrapper>
)

const TASKS_PER_PAGE = 8

const Pg = spc.Page`
  padding-bottom: 6mm;
`

const ROW_WIDTH = 2
const MARKS = Array(ROW_WIDTH + TASKS_PER_PAGE + TASKS_PER_PAGE / ROW_WIDTH)
  .fill(0)
  .map((_, i) => {
    const y = Math.floor(i / (ROW_WIDTH + 1))
    const x = i % (ROW_WIDTH + 1)
    return [`${x * (100 / ROW_WIDTH)}%`, `${y * (100 / (TASKS_PER_PAGE / ROW_WIDTH))}%`]
  })

const MARK_STYLES = [
  {
    height: "0.3pt",
    width: "12mm",
    marginLeft: "-6mm",
  },
  {
    width: "0.3pt",
    height: "12mm",
    marginTop: "-6mm",
  },
]

const Mark = spc.View`
  position: absolute;
  background-color: black;
`

const Marks = () => {
  return Array(MARK_STYLES.length)
    .fill(0)
    .map((_, g) =>
      MARKS.map(([x, y], i) => (
        <Mark
          fixed
          key={i}
          style={{
            left: x,
            top: y,
            ...MARK_STYLES[g],
          }}
        />
      ))
    )
}

export default function PrintClient({ tasks }: { tasks: (Task & { playerCode: string; setupCode: string })[] }) {
  return (
    <PDFViewer className="h-screen w-full">
      <Document style={{ fontFamily: "SF Pro" }}>
        {Array(Math.ceil(tasks.length / TASKS_PER_PAGE))
          .fill(0)
          .map((_, i) => {
            const t = tasks.slice(i * TASKS_PER_PAGE, i * TASKS_PER_PAGE + TASKS_PER_PAGE)
            return (
              <Fragment key={i}>
                <Pg>
                  <Marks />
                  <Row style={{ height: "100%", flexWrap: "wrap", position: "relative" }}>
                    {t.map((task) => (
                      <InfoSection key={task.id} setupCode={task.setupCode} />
                    ))}
                  </Row>
                </Pg>
                <Pg>
                  <Marks />
                  <Row style={{ height: "100%", flexWrap: "wrap", position: "relative" }}>
                    {t.map((task) => (
                      <TaskSection key={task.id} task={task} />
                    ))}
                  </Row>
                </Pg>
              </Fragment>
            )
          })}
      </Document>
    </PDFViewer>
  )
}
