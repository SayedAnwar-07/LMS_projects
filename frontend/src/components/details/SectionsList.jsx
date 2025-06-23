import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSections,
  selectAllSections,
  selectCurriculumStatus,
  selectCurriculumError,
} from "@/redux/features/curriculumSlice";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const SectionsList = () => {
  const dispatch = useDispatch();
  const sections = useSelector(selectAllSections);
  const status = useSelector(selectCurriculumStatus);
  const error = useSelector(selectCurriculumError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSections());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => dispatch(fetchSections())}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Sections</CardTitle>
        <CardDescription>All available course sections</CardDescription>
      </CardHeader>
      <Accordion type="multiple" className="w-full px-6 pb-6">
        {sections.length === 0 ? (
          <p>No sections found</p>
        ) : (
          sections.map((section) => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="hover:no-underline px-4 py-3 border rounded-lg">
                <h3 className="font-medium text-left">{section.title}</h3>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2">
                <p className="text-sm text-gray-600">{section.description}</p>
              </AccordionContent>
            </AccordionItem>
          ))
        )}
      </Accordion>
    </Card>
  );
};

export default SectionsList;
