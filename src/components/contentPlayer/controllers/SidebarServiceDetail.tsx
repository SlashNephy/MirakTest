import clsx from "clsx"
import dayjs from "dayjs"
import React, { memo, useState } from "react"
import { ChevronsRight } from "react-feather"
import { Service, Program } from "../../../infra/mirakurun/api"
import { EscapeEnclosed } from "../../common/EscapeEnclosed"

export const SidebarServiceDetail = memo(
  ({
    service,
    queriedPrograms,
    setService,
  }: {
    service: Service
    queriedPrograms: Program[]
    setService: (s: Service) => void
  }) => {
    const programs = queriedPrograms
      .filter(
        (program) =>
          program.serviceId === service.serviceId &&
          program.networkId === service.networkId
      )
      .sort((a, b) => a.startAt - b.startAt)
    const current = programs?.[0]
    const next = programs?.[1]
    const [whenMouseDown, setWhenMouseDown] = useState(0)
    return (
      <a
        key={service.id}
        onMouseDown={() => setWhenMouseDown(performance.now())}
        onMouseUp={() => {
          if (performance.now() - whenMouseDown < 200) {
            setService(service)
          }
        }}
        onClick={(e) => e.preventDefault()}
        className={clsx("cursor-pointer")}
      >
        <div
          className={clsx(
            "p-3",
            "rounded-md",
            "bg-gray-800",
            "bg-opacity-70",
            "mt-2",
            "pointer-events-none",
            "mx-1"
          )}
        >
          <div
            className={clsx(
              "flex",
              "space-x-2",
              "items-center",
              "overflow-hidden",
              "w-full",
              "truncate"
            )}
            title={service.name}
          >
            {service.logoData && (
              <img
                className={clsx("h-6", "rounded-md", "flex-shrink-0")}
                src={`data:image/jpeg;base64,${service.logoData}`}
              />
            )}
            <h3 className={clsx("flex-shrink-0")}>{service.name}</h3>
          </div>
          {current?.name && (
            <div className={clsx(service.logoData ? "mt-2" : "mt-1")}>
              <h4 className={clsx("text-lg", "leading-snug")}>
                <EscapeEnclosed str={current.name || ""} />
              </h4>
              <p>
                {dayjs(current.startAt).format("HH:mm")}〜
                {dayjs(current.startAt + current.duration).format("HH:mm")} (
                {Math.floor(current.duration / 1000 / 60)}分間)
              </p>
              <p className={clsx("my-1", "text-sm")}>
                <EscapeEnclosed
                  str={
                    current.description?.trim() ||
                    Object.values(current.extended || {}).shift() ||
                    ""
                  }
                />
              </p>
            </div>
          )}
          {next?.name && (
            <div className={clsx("text-sm")}>
              Next
              <ChevronsRight size="1rem" className={clsx("inline")} />
              <span>
                {dayjs(next.startAt).format("HH:mm")}〜
                {dayjs(next.startAt + next.duration).format("HH:mm")}{" "}
                <EscapeEnclosed str={next.name || ""} /> (
                {Math.floor(next.duration / 1000 / 60)}
                分間)
              </span>
            </div>
          )}
        </div>
      </a>
    )
  }
)