import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import ComingSoonPlaceholder from "@/components/tafsiir/ComingSoonPlaceholder";

const SurahQaariaahPage = () => {
    // Data for Surah Al-Qaari'ah (101)
    const qaariaahData = {
        nameMeaning: "Al-Qaari'ah (القارعة) waxaa loola jeedaa 'Tan wax garaacda' ama 'Dhawaaq naxdin leh' (waa mid ka mid ah magacyada Maalinta Qiyaamaha).",
        revelationType: "Waa Makki (مكية). Waxay si xooggan u sawiraysaa naxdinta Maalinta Qiyaamaha iyo kala bixidda dadka.",
        revelationContext: "Suuraddan waxay u timid inay bini-aadamka uga digto maalinta dadku ay noqon doonaan sida balanbaalis firdhay, buurahana ay noqon doonaan sida dhogorta la tuman.",
        mainTheme: "Caddaynta weynida miisaanka camalka iyo siday dadku ugu kala bixi doonaan laba kooxood: kuwa miisaankoodu cuslaado (liibaana) iyo kuwa miisaankoodu fududaado (halaagsama)."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={101} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO SECTION: Premium "Dhawaan Filo" Glass-Blur Placeholder */}
                <div className="w-full -mt-8 relative">
                    <ComingSoonPlaceholder />
                </div>

                {/* Surah Details - Foldable Glass Grid */}
                <CollapsibleSurahGrid data={qaariaahData} />
            </div>
        </div>
    );
};

export default SurahQaariaahPage;
