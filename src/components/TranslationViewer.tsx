import { Card } from "@/components/ui/card";

const TranslationViewer = () => {
  // Sample translation data
  const translation = {
    title: "The Heart Sutra",
    tibetanTitle: "བཅོམ་ལྡན་འདས་མ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པའི་སྙིང་པོ",
    sourceText: "རྒྱ་གར་སྐད་དུ། བྷ་ག་ཝ་ཏི་པྲཛྙཱ་པཱ་ར་མི་ཏཱ་ཧྲྀ་ད་ཡ།",
    translatedText: "Thus I have heard. At one time the Blessed One was dwelling in Rajagriha at Vulture Peak mountain, together with a great gathering of the sangha of monks and a great gathering of the sangha of bodhisattvas.",
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{translation.title}</h3>
        <p className="tibetan-text text-tibetan-maroon">{translation.tibetanTitle}</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-tibetan-brown">Tibetan</h4>
          <p className="tibetan-text">{translation.sourceText}</p>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold text-tibetan-brown">English</h4>
          <p className="leading-relaxed">{translation.translatedText}</p>
        </div>
      </div>
    </Card>
  );
};

export default TranslationViewer;