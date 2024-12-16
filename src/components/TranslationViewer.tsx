import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const TranslationViewer = ({ translation }: { translation: any }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/translation/${translation.id}`);
  };

  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={handleClick}
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{translation.title}</h3>
        {translation.tibetan_title && (
          <p className="text-tibetan-maroon font-tibetan text-xl">
            {translation.tibetan_title}
          </p>
        )}
      </div>
    </Card>
  );
};

export default TranslationViewer;