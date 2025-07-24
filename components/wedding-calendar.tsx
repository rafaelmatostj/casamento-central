"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Heart, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
  onCoupleSelect: (couple: Couple) => void
}

export function WeddingCalendar({ couples, parseDate, onCoupleSelect }: WeddingCalendarProps) {
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
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-center sm:justify-start gap-2 text-base sm:text-lg mb-3 sm:mb-0">
          <Heart className="h-5 w-5 text-pink-500" />
          Calendário de Aniversários
        </CardTitle>
        
        <div className="flex justify-center sm:justify-end mt-2 sm:mt-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-base sm:text-lg font-semibold w-32 sm:w-40 text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-bold text-xs text-gray-500">
              {day.charAt(0)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((day, index) => {
            const anniversaries = day ? getAnniversariesForDay(day) : []
            const hasAnniversary = anniversaries.length > 0
            const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()

            return (
              <div
                key={index}
                onClick={() => {
                  if (anniversaries.length === 1) {
                    onCoupleSelect(anniversaries[0])
                  } else if (anniversaries.length > 1) {
                    // We'll handle this with the popover trigger
                  }
                }}
                className={`relative min-h-[60px] sm:min-h-[90px] p-1 sm:p-2 border rounded-md transition-colors ${
                  day ? "bg-white" : "bg-gray-50/50"
                } ${
                  hasAnniversary
                    ? "border-pink-300 bg-pink-50/80 cursor-pointer hover:bg-pink-100"
                    : "border-gray-200"
                }`}
              >
                {day && (
                  <>
                    <div className={`text-xs sm:text-sm font-bold ${isToday ? 'text-white bg-pink-500 rounded-full w-5 h-5 flex items-center justify-center' : ''}`}>{day}</div>
                    <div className="absolute bottom-1 left-1 right-1 space-y-1">
                      {anniversaries.length === 1 && (
                        <div className="text-center">
                          <Badge variant="secondary" className="text-[9px] sm:text-[10px] leading-tight bg-pink-100 text-pink-800 p-0.5 rounded-sm">
                            {anniversaries[0].husband.charAt(0)}&{anniversaries[0].wife.charAt(0)}
                          </Badge>
                        </div>
                      )}
                      {anniversaries.length > 1 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="text-center w-full">
                              <Badge variant="secondary" className="text-[9px] sm:text-[10px] leading-tight bg-pink-100 text-pink-800 p-0.5 rounded-sm w-full">
                                {anniversaries.length} casais
                              </Badge>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 p-2">
                            <div className="space-y-2">
                              <div className="text-xs font-medium text-center text-gray-500 mb-1">
                                Selecione um casal:
                              </div>
                              {anniversaries.map((couple) => (
                                <div
                                  key={couple.id}
                                  className="flex items-center p-2 text-sm rounded-md hover:bg-gray-100 cursor-pointer"
                                  onClick={() => onCoupleSelect(couple)}
                                >
                                  <User className="h-4 w-4 mr-2 text-pink-500" />
                                  <span className="truncate">{couple.husband.split(' ')[0]} & {couple.wife.split(' ')[0]}</span>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
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
