import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

const categories = [
  {
    title: "AMAI",
    description: "Amitābha Institute Translations",
  },
  {
    title: "GRAM",
    description: "Grammar & Language Studies",
  },
  {
    title: "SALO",
    description: "Sakya Lotsawa Translations",
  },
];

export function CategorySidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-tibetan text-lg text-tibetan-maroon">
            Translation Categories
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <SidebarMenu>
                {categories.map((category) => (
                  <SidebarMenuItem key={category.title}>
                    <SidebarMenuButton className="w-full">
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-tibetan-maroon">
                          {category.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {category.description}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}