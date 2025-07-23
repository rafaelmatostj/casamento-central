"use client"

import { useState, useMemo } from "react"
import { Calendar, Heart, Users, Clock, Filter, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeddingCalendar } from "@/components/wedding-calendar"
import { CouplesList } from "@/components/couples-list"
import { Timeline } from "@/components/timeline"
import { UpcomingAnniversaries } from "@/components/upcoming-anniversaries"
import { CoupleDetails } from "@/components/couple-details"

// Dados dos casais da congregação
export const couplesData = [
  {
    id: 1,
    husband: "Erick Soares",
    wife: "Juciane Guedes Lima",
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
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
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
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
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
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
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
  },
  {
    id: 8,
    husband: "Gabriela Matos",
    wife: "Rafael Matos",
    weddingDate: "16/01/2020",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: true,
  },
  {
    id: 9,
    husband: "Daffny",
    wife: "Raulison Barros",
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
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
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
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
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
  },
  {
    id: 14,
    husband: "Rone Pereira",
    wife: "Sandra dos Santos",
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
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
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
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
    weddingDate: "",
    photo: "/placeholder.svg?height=100&width=100",
    hasWeddingDate: false,
  },
  {
    id: 22,
    husband: "Ed Lilian Garcez",
    wife: "Tiago Garcez",
    weddingDate: "16/01/2010",
    photo: "/placeholder.svg?height=100&width=100",
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
  const [selectedCouple, setSelectedCouple] = useState<any>(null)

  const parseDate = (dateString: string) => {
    if (!dateString) return null
    const [day, month, year] = dateString.split("/")
    return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
  }

  const calculateMarriageTime = (weddingDate: string) => {
    if (!weddingDate) return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }

    const wedding = parseDate(weddingDate)
    if (!wedding) return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }

    const now = new Date()
    const diff = now.getTime() - wedding.getTime()

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44))
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { years, months, days, hours, minutes, seconds }
  }

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
            <h1 className="text-4xl font-bold text-gray-800">Calendário de Casamentos</h1>
            <Heart className="h-8 w-8 text-pink-500" />
          </div>
          <p className="text-lg text-gray-600">Congregação das Testemunhas de Jeová</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Casais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCouples}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média de Anos Casados</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageYears} anos</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximos Aniversários</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  couplesData.filter((couple) => {
                    if (!couple.hasWeddingDate) return false
                    const today = new Date()
                    const weddingDate = parseDate(couple.weddingDate)
                    if (!weddingDate) return false
                    const thisYearAnniversary = new Date(
                      today.getFullYear(),
                      weddingDate.getMonth(),
                      weddingDate.getDate(),
                    )
                    const daysUntil = Math.ceil(
                      (thisYearAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
                    )
                    return daysUntil >= 0 && daysUntil <= 30
                  }).length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar Casal</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Digite o nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ordenar por</label>
                <Select value={sortBy} onValueChange={setSortBy}>
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
                <Select value={filterByMonth} onValueChange={setFilterByMonth}>
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
                <Select value={filterByDateStatus} onValueChange={setFilterByDateStatus}>
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
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="couples">Lista de Casais</TabsTrigger>
            <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
            <TabsTrigger value="anniversaries">Aniversários</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <WeddingCalendar couples={filteredAndSortedCouples} parseDate={parseDate} />
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
            <Timeline couples={couplesData} parseDate={parseDate} calculateMarriageTime={calculateMarriageTime} />
          </TabsContent>

          <TabsContent value="anniversaries">
            <UpcomingAnniversaries couples={couplesData} parseDate={parseDate} />
          </TabsContent>
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
