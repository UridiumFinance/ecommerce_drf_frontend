import classNames from "@/utils/classnames";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

interface ComponentProps {
  titles: string[];
  panels: any[];
  width?: string;
}

export default function CustomTabs({ titles, panels, width = "md:w-32 w-full" }: ComponentProps) {
  function getTabClassName(selected: any) {
    return classNames(
      `flex  items-center justify-center col-span-1 ${width} py-2.5 text-sm leading-5 md:col-span-2 focus:outline-none`,
      selected
        ? " border-b-4 border-[#2d2f31] font-bold text-black"
        : " border-b-4 hover:border-[#2d2f31] font-semibold text-gray-600 hover:border-gray-200 ",
    );
  }

  return (
    <TabGroup>
      <div className="dark:bg-dark-main" id="auctions_tabs">
        <TabList className="grid space-y-1 space-x-1 sm:flex sm:space-y-0 sm:space-x-2">
          {titles?.map((title, index) => (
            <Tab key={index} className={({ selected }) => getTabClassName(selected)}>
              {title}
            </Tab>
          ))}
        </TabList>
      </div>
      <div className="mx-auto max-w-7xl">
        {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
        <div className="mx-auto max-w-7xl">
          {/* Content goes here */}
          <TabPanels as="div">
            {panels?.map((panel, index) => (
              <TabPanel key={index}>
                <div className="py-4">{panel}</div>
              </TabPanel>
            ))}
          </TabPanels>
        </div>
      </div>
    </TabGroup>
  );
}

CustomTabs.defaultProps = {
  width: "md:w-32 w-full",
};
