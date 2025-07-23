"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Couple {
  id: number
  husband: string
  wife: string
  weddingDate: string
  yearsMarried: number
  photo: string
  hasWeddingDate: boolean
}

interface WeddingCalendarProps {
  couples: Couple[]
  parseDate: (dateString: string) => Date | null
}

export function WeddingCalendar({ couples, parseDate }: WeddingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getAnniversariesForDay = (day: number) => {
    if (!day) return []

    const month = currentDate.getMonth() + 1
    return couples.filter((couple) => {
      if (!couple.hasWeddingDate) return false
      const weddingDate = parseDate(couple.weddingDate)
      if (!weddingDate) return false
      return weddingDate.getMonth() + 1 === month && weddingDate.getDate() === day
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentDate)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Calendário de Aniversários
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold min-w-[200px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-semibold text-sm text-gray-600 p-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const anniversaries = day ? getAnniversariesForDay(day) : []
            const hasAnniversary = anniversaries.length > 0

            return (
              <div
                key={index}
                className={`min-h-[80px] p-2 border rounded-lg ${
                  day ? "bg-white hover:bg-gray-50" : "bg-gray-100"
                } ${hasAnniversary ? "border-pink-300 bg-pink-50" : "border-gray-200"}`}
              >
                {day && (
                  <>
                    <div className="font-semibold text-sm mb-1">{day}</div>
                    {anniversaries.map((couple) => (
                      <div key={couple.id} className="space-y-1">
                        <Badge variant="secondary" className="text-xs bg-pink-100 text-pink-800">
                          {new Date().getFullYear() - parseDate(couple.weddingDate)!.getFullYear()}º ano
                        </Badge>
                        <div className="text-xs text-gray-600 leading-tight">
                          {couple.husband.split(" ")[0]} & {couple.wife.split(" ")[0]}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
