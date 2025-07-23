"use client"

import { useState, useMemo } from "react"
import { Calendar, Heart, Users, Clock, Filter, Search, Gift } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeddingCalendar } from "@/components/wedding-calendar"
import { CouplesList } from "@/components/couples-list"
import { Timeline } from "@/components/timeline"
import { UpcomingAnniversaries } from "@/components/upcoming-anniversaries"
import { CoupleDetails } from "@/components/couple-details"

// Funções auxiliares
const parseDate = (dateString: string) => {
  if (!dateString) return null
  const parts = dateString.split("/")
  if (parts.length !== 3) return null
  return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
}

const calculateMarriageTime = (weddingDate: string) => {
  const date = parseDate(weddingDate)
  if (!date) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, text: "Data inválida" }
  }

  const today = new Date()
  let years = today.getFullYear() - date.getFullYear()
  let months = today.getMonth() - date.getMonth()
  let days = today.getDate() - date.getDate()

  if (days < 0) {
    months--
    const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate()
    days += prevMonthLastDay
  }

  if (months < 0) {
    years--
    months += 12
  }

  const diff = today.getTime() - date.getTime()
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { years, months, days, hours, minutes, seconds, text: `${years} anos, ${months} meses, ${days} dias` }
}

const getNextAnniversaryInfo = (couple: (typeof couplesData)[0]) => {
  if (!couple.hasWeddingDate || !couple.weddingDate) {
    return { date: null, daysUntil: Infinity }
  }

  const weddingDate = parseDate(couple.weddingDate)
  if (!weddingDate) {
    return { date: null, daysUntil: Infinity }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let nextAnniversary = new Date(today.getFullYear(), weddingDate.getMonth(), weddingDate.getDate())
  if (nextAnniversary < today) {
    nextAnniversary.setFullYear(today.getFullYear() + 1)
  }

  const daysUntil = Math.ceil((nextAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return { date: nextAnniversary, daysUntil }
}

// Dados dos casais da congregação
export const couplesData = [
  {
    id: 1,
    husband: "Erick Soares",
    wife: "Juciane Guedes Lima",
    weddingDate: "16/03/2024",
    photo: "erick-ju.png",
    hasWeddingDate: true,
  },
  {
    id: 2,
    husband: "Frederico Garcez",
    wife: "Zilmara",
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
  },
  {
    id: 3,
    husband: "Raianny Queiroz",
    wife: "Wagner Henrique",
    weddingDate: "26/06/2021",
    photo: "wagner-raiane.png",
    hasWeddingDate: true,
  },
  {
    id: 4,
    husband: "Ademilson Ribeiro",
    wife: "Edeltra Ribeiro",
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
  },
  {
    id: 5,
    husband: "Dayane Borges",
    wife: "Rafael Borges",
    weddingDate: "20/09/2013",
    photo: "day-rafa.png",
    hasWeddingDate: true,
  },
  {
    id: 6,
    husband: "Eliane dos Reis",
    wife: "Veronaldo dos Santos",
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
  },
  {
    id: 7,
    husband: "Erisson Soares",
    wife: "Fernanda Sthephany",
    weddingDate: "16/06/2021",
    photo: "erisson-fer.png",
    hasWeddingDate: true,
  },
  {
    id: 8,
    husband: "Gabriela Matos",
    wife: "Rafael Matos",
    weddingDate: "16/01/2020",
    photo: "rafael-gabi.jpg",
    hasWeddingDate: true,
  },
  {
    id: 9,
    husband: "Daffny",
    wife: "Raulison Barros",
    weddingDate: "23/08/2018",
    photo: "daff-raul.png",
    hasWeddingDate: true,
  },
  {
    id: 10,
    husband: "Geane Reis",
    wife: "Mauro Sérgio",
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
  },
  {
    id: 11,
    husband: "José Adriano",
    wife: "Ruth Silva",
    weddingDate: "09/09/2024",
    photo: "adriano-rute.png",
    hasWeddingDate: true,
  },
  {
    id: 12,
    husband: "Patricia Rodrigues",
    wife: "Welton Rodrigues",
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
  },
  {
    id: 13,
    husband: "Pollyanna silva",
    wife: "Walter Silva",
    weddingDate: "13/07/2007",
    photo: "poly-walter.png",
    hasWeddingDate: true,
  },
  {
    id: 14,
    husband: "Rone Pereira",
    wife: "Sandra dos Santos",
    weddingDate: "11/09/2010",
    photo: "rone-sadra.png",
    hasWeddingDate: true,
  },
  {
    id: 15,
    husband: "Airton Silva",
    wife: "Rita Alves",
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
  },
  {
    id: 16,
    husband: "Amandah Freitas",
    wife: "Arthur De Freitas",
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
  },
  {
    id: 17,
    husband: "Bruno Pimentel",
    wife: "Priscila Pimentel",
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
  },
  {
    id: 18,
    husband: "Jair Miranda",
    wife: "Katia Miranda",
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
  },
  {
    id: 19,
    husband: "Neide Teixeira",
    wife: "Wenderson Ornel",
    weddingDate: "14/07/2022",
    photo: "wende-neide.png",
    hasWeddingDate: true,
  },
  {
    id: 20,
    husband: "Odair Plácido",
    wife: "Thays Plácido",
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
  },
  {
    id: 21,
    husband: "Adriana R. Albernaz",
    wife: "Vinícius Albernaz",
    weddingDate: "30/06/2017",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: true,
  },
  {
    id: 22,
    husband: "Ed Lilian Garcez",
    wife: "Tiago Garcez",
    weddingDate: "16/01/2010",
    photo: "tiago-edlilian.png",
    hasWeddingDate: true,
  },
  {
    id: 23,
    husband: "Katiana da Silva",
    wife: "Ruimar Paulino",
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
  },
]

export default function WeddingCalendarApp() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterByMonth, setFilterByMonth] = useState("all")
  const [filterByDateStatus, setFilterByDateStatus] = useState("all")
  const [selectedCouple, setSelectedCouple] = useState<(typeof couplesData)[0] | null>(null)
  const [activeTab, setActiveTab] = useState("calendar")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (e.target.value) {
      setActiveTab("couples")
    }
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setActiveTab("couples")
  }

  const handleFilterMonthChange = (value: string) => {
    setFilterByMonth(value)
    setActiveTab("couples")
  }

  const handleFilterDateStatusChange = (value: string) => {
    setFilterByDateStatus(value)
    setActiveTab("couples")
  }



  const upcomingAnniversaryCouple = useMemo(() => {
    return couplesData
      .filter(c => c.hasWeddingDate)
      .map(c => ({ ...c, anniversaryInfo: getNextAnniversaryInfo(c) }))
      .sort((a, b) => a.anniversaryInfo.daysUntil - b.anniversaryInfo.daysUntil)[0]
  }, [couplesData])

  const totalMarriageYears = useMemo(() => {
    return couplesData
      .filter(c => c.hasWeddingDate)
      .reduce((acc, couple) => {
        const marriageTime = calculateMarriageTime(couple.weddingDate)
        return acc + marriageTime.years
      }, 0)
  }, [couplesData])





  const filteredAndSortedCouples = useMemo(() => {
    let filtered = couplesData.filter(
      (couple) =>
        couple.husband.toLowerCase().includes(searchTerm.toLowerCase()) ||
        couple.wife.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filterByMonth !== "all") {
      filtered = filtered.filter((couple) => {
        if (!couple.hasWeddingDate) return false
        const date = parseDate(couple.weddingDate)
        if (!date) return false
        const month = date.getMonth() + 1
        return month.toString() === filterByMonth
      })
    }

    if (filterByDateStatus !== "all") {
      filtered = filtered.filter((couple) => {
        if (filterByDateStatus === "with-date") return couple.hasWeddingDate
        if (filterByDateStatus === "without-date") return !couple.hasWeddingDate
        return true
      })
    }

    return filtered.sort((a, b) => {
      // Casais sem data sempre vão para o final
      if (!a.hasWeddingDate && b.hasWeddingDate) return 1
      if (a.hasWeddingDate && !b.hasWeddingDate) return -1
      if (!a.hasWeddingDate && !b.hasWeddingDate) return a.husband.localeCompare(b.husband)

      const dateA = parseDate(a.weddingDate)
      const dateB = parseDate(b.weddingDate)

      if (!dateA || !dateB) return 0

      if (sortBy === "newest") {
        return dateB.getTime() - dateA.getTime()
      } else if (sortBy === "oldest") {
        return dateA.getTime() - dateB.getTime()
      } else if (sortBy === "name") {
        return a.husband.localeCompare(b.husband)
      }
      return 0
    })
  }, [searchTerm, sortBy, filterByMonth, filterByDateStatus])

  const totalCouples = couplesData.length
  const couplesWithDate = couplesData.filter((couple) => couple.hasWeddingDate)
  const couplesWithoutDate = couplesData.filter((couple) => !couple.hasWeddingDate)

  const averageYears =
    couplesWithDate.length > 0
      ? Math.round(
          couplesWithDate.reduce((sum, couple) => {
            const marriageTime = calculateMarriageTime(couple.weddingDate)
            return sum + marriageTime.years
          }, 0) / couplesWithDate.length,
        )
      : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Calendário de Casamentos</h1>
            <Heart className="h-8 w-8 text-pink-500" />
          </div>
          <p className="text-lg text-gray-600">Congregação Central de Aparecida</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Casais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{couplesData.length}</div>
              <p className="text-xs text-muted-foreground">Casais na congregação</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximo Aniversário</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">{upcomingAnniversaryCouple.husband} & {upcomingAnniversaryCouple.wife}</div>
              <p className="text-xs text-muted-foreground">
                Em {upcomingAnniversaryCouple.anniversaryInfo.daysUntil} dias ({upcomingAnniversaryCouple.anniversaryInfo.date?.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })})
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anos de Casamento</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMarriageYears}</div>
              <p className="text-xs text-muted-foreground">Soma de todos os anos de união</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por nome..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-8 w-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ordenar por</label>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mais Recentes</SelectItem>
                  <SelectItem value="oldest">Mais Antigos</SelectItem>
                  <SelectItem value="name">Nome (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Filtrar por Mês</label>
              <Select value={filterByMonth} onValueChange={handleFilterMonthChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Meses</SelectItem>
                  <SelectItem value="1">Janeiro</SelectItem>
                  <SelectItem value="2">Fevereiro</SelectItem>
                  <SelectItem value="3">Março</SelectItem>
                  <SelectItem value="4">Abril</SelectItem>
                  <SelectItem value="5">Maio</SelectItem>
                  <SelectItem value="6">Junho</SelectItem>
                  <SelectItem value="7">Julho</SelectItem>
                  <SelectItem value="8">Agosto</SelectItem>
                  <SelectItem value="9">Setembro</SelectItem>
                  <SelectItem value="10">Outubro</SelectItem>
                  <SelectItem value="11">Novembro</SelectItem>
                  <SelectItem value="12">Dezembro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status da Data</label>
              <Select value={filterByDateStatus} onValueChange={handleFilterDateStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="with-date">Com Data</SelectItem>
                  <SelectItem value="without-date">Sem Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 gap-2">
            <TabsTrigger value="calendar" className="text-xs sm:text-sm">Calendário</TabsTrigger>
            <TabsTrigger value="couples" className="text-xs sm:text-sm">Lista</TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs sm:text-sm">Timeline</TabsTrigger>
            <TabsTrigger value="anniversaries" className="text-xs sm:text-sm">Aniversários</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="calendar">
              <WeddingCalendar couples={filteredAndSortedCouples} parseDate={parseDate} onCoupleSelect={setSelectedCouple} />
            </TabsContent>

            <TabsContent value="couples">
              <CouplesList
                couples={filteredAndSortedCouples}
                parseDate={parseDate}
                calculateMarriageTime={calculateMarriageTime}
                onCoupleClick={setSelectedCouple}
              />
            </TabsContent>

            <TabsContent value="timeline">
              <Timeline couples={couplesData} parseDate={parseDate} calculateMarriageTime={calculateMarriageTime} onCoupleClick={setSelectedCouple} />
            </TabsContent>

            <TabsContent value="anniversaries">
              <UpcomingAnniversaries couples={couplesData} parseDate={parseDate} />
            </TabsContent>
          </div>
        </Tabs>

        {/* Couple Details Modal */}
        {selectedCouple && (
          <CoupleDetails
            couple={selectedCouple}
            parseDate={parseDate}
            calculateMarriageTime={calculateMarriageTime}
            onClose={() => setSelectedCouple(null)}
          />
        )}
      </div>
    </div>
  )
}
