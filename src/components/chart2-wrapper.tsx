import { useState, useEffect } from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


import Chart2 from './chart2'

function ChartWrapper({ absolutne }: { absolutne: any }) {

    const [selectedCategory, setSelectedCategory] = useState<string>('Elektronické a telekomunikační zboží')
    const [view, setView] = useState<string>('rel')

    useEffect(() => {
        if (selectedCategory === "Výzbroj") {
            setView("abs")
        }
    }, [selectedCategory, view])


    return (
        <>
            <h2 className="text-xl font-semibold mt-10">Struktura českého high-tech vývozu a dovozu</h2>
            <div className="flex justify-center">
                <div className="flex items-end  flex-wrap gap-6 py-3 pb-6">
                    <div>
                        <Label htmlFor="category">Vyberte kategorii</Label>
                        <Select defaultValue={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
                            <SelectTrigger className="min-w-[280px]">
                                <SelectValue placeholder="Vyberte kategorii" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Všechny kategorie</SelectItem>
                                <SelectItem value="Výpočetní technika">Výpočetní technika</SelectItem>
                                <SelectItem value="Elektronické a telekomunikační zboží">Elektronické a telekomunikační zboží</SelectItem>
                                <SelectItem value="Vědecké přístroje">Vědecké přístroje</SelectItem>
                                <SelectItem value="Neelektrické stroje">Neelektrické stroje</SelectItem>
                                <SelectItem value="Elektrotechnika">Elektrotechnika</SelectItem>
                                <SelectItem value="Farmaceutické zboží">Farmaceutické zboží</SelectItem>
                                <SelectItem value="Letecká technika">Letecká technika</SelectItem>
                                <SelectItem value="Chemikálie">Chemikálie</SelectItem>
                                <SelectItem value="Výzbroj">Výzbroj</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <RadioGroup defaultValue={view} onValueChange={(value) => setView(value)} disabled={selectedCategory === "Výzbroj"}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="abs" id="abs" />
                                <Label htmlFor="abs">absolutně</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="rel" id="rel" />
                                <Label htmlFor="rel">relativně</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </div>
            {selectedCategory === "Výzbroj" && <p className="text-xs pb-3">U výzbroje není k dispozici podrobnější členění. Vývoz výzbroje také nezachycuje úplný rozsah této kategorie z důvodu možného utajení.</p>}

            <div>
                <Chart2 data={absolutne} type="Vývoz" selected={selectedCategory} view={view} />
                <Chart2 data={absolutne} type="Dovoz" selected={selectedCategory} view={view} />
            </div>

        </>
    );
}

export default ChartWrapper;