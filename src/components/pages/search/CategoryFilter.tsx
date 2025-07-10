import { ICategory } from "@/interfaces/products/ICategory";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

interface ComponentProps {
  categories: ICategory[];
  categoriesSlugList: string[];
  setCategoriesSlugList: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function CategoryFilter({
  categories,
  categoriesSlugList,
  setCategoriesSlugList,
}: ComponentProps) {
  const handleToggleCategory = (categorySlug: string) => {
    setCategoriesSlugList(prevSelected =>
      prevSelected.includes(categorySlug)
        ? prevSelected.filter(slug => slug !== categorySlug)
        : [...prevSelected, categorySlug],
    );
  };

  return (
    <Disclosure as="div" className="border-b border-gray-200 py-6">
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
          <span className="font-medium text-gray-900">Categories</span>
          <span className="ml-6 flex items-center">
            <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
            <MinusIcon aria-hidden="true" className="hidden h-5 w-5 group-data-[open]:inline" />
          </span>
        </DisclosureButton>
      </h3>
      <DisclosurePanel className="pt-6">
        <div className="space-y-4">
          {categories && categories.length > 0 ? (
            categories.map(category => (
              <label key={category.slug} className="flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={categoriesSlugList.includes(category.slug)}
                  onChange={() => handleToggleCategory(category.slug)}
                />
                <span className="dark:text-dark-txt-secondary text-sm text-gray-700">
                  {category.name}
                </span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500">No categories found</p>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
