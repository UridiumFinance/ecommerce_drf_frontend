import { useCallback, useEffect, useRef, useState } from "react";
import { useClickOutside } from "react-click-outside-hook";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import useDebounce from "@/hooks/useDebounce";
import useProducts from "@/hooks/useProducts";

export function CloseIcon({ zIndex = 1, ...props }) {
  return (
    <motion.span
      className={`align-middle text-xl text-gray-400 transition-all duration-200 ease-in-out hover:text-gray-400 ${zIndex === 1 ? "" : "pointer-events-none"}`}
      style={{ zIndex }}
      {...props}
    />
  );
}

export function SearchKeyIcon({ zIndex = 1, ...props }) {
  return (
    <motion.span
      className={`align-middle text-xl text-gray-400 transition-all duration-200 ease-in-out hover:text-gray-400 ${zIndex === 1 ? "" : "pointer-events-none"}`}
      style={{ zIndex }}
      {...props}
    />
  );
}

export function LoadingWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full w-full items-center justify-center">{children}</div>;
}

export function WarningMessage({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center justify-center py-4 text-sm text-gray-400">{children}</span>
  );
}

export default function SearchBar() {
  const { products, loading, listProducts, setProducts } = useProducts({
    searchBy: undefined,
    pageSize: 6,
    fetchOnMount: false,
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const [parentRef, isClickedOutside] = useClickOutside();
  const inputRef: any = useRef(null);

  const isEmpty = !loading && products.length === 0 && searchQuery.trim() !== "";

  const searchData = useCallback(async () => {
    const term = searchQuery.trim();

    if (term === "") {
      setProducts([]);
      return;
    }

    // disparamos la carga de página 1 con el término
    await listProducts(1, term);
  }, [searchQuery, listProducts, setProducts]);

  // 2. Usa useDebounce para llamar a searchData 500 ms después del último cambio
  useDebounce(searchQuery, 500, searchData);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === "") {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  };

  const inputFocus = () => {
    inputRef.current.focus();
  };

  const inputUnFocus = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const expandContainer = () => {
    setExpanded(true);
    inputFocus();
  };

  const collapseContainer = () => {
    setExpanded(false);
    setSearchQuery("");
    inputUnFocus();
    setProducts([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (isClickedOutside) collapseContainer();
  }, [isClickedOutside]);

  useEffect(() => {
    const handleEsc = (event: any) => {
      if (event.keyCode === 27) {
        collapseContainer();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const keydownHandler = (e: any) => {
    // e.key === '/' && e.ctrlKey;
    if (e.key === "/" && e.ctrlKey) {
      e.preventDefault(); // Add this line
      inputFocus();
      // expandContainer();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keydownHandler);

    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  const onSubmitSearch = (e: any) => {
    e.preventDefault();
    collapseContainer();
    if (searchQuery !== "") window.location.href = `/search/${searchQuery}`;
  };

  return (
    <div ref={parentRef} className="relative flex">
      <motion.div
        className="border-opacity-50 bg-opacity-40 h-12 w-full rounded-full border border-gray-600 bg-gray-50"
        animate={isExpanded ? "expanded" : "collapsed"}
      >
        <div className="flex min-h-12 w-full px-4">
          <form onSubmit={onSubmitSearch} className="flex w-full items-center">
            <span className="align-middle text-lg text-gray-700">
              <IoSearch />
            </span>
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={changeHandler}
              className="h-full w-full rounded-md border-none bg-transparent pl-4 text-sm outline-none placeholder:text-gray-600 focus:outline-none"
              type="text"
              placeholder="Search for anything"
              onFocus={() => expandContainer()}
            />
          </form>
          <AnimatePresence>
            {isExpanded ? (
              <CloseIcon
                zIndex={1}
                key="close-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    inputUnFocus();
                    collapseContainer();
                  }}
                  className="absolute inset-y-0 right-0 mr-3 flex py-3 pr-1.5"
                >
                  <kbd className="inline-flex items-center rounded-lg border border-gray-400 px-3.5 text-sm font-medium shadow-inner">
                    Esc
                  </kbd>
                </button>
              </CloseIcon>
            ) : (
              <SearchKeyIcon
                zIndex={1}
                key="search-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    inputFocus();
                    expandContainer();
                  }}
                  className="absolute inset-y-0 right-0 mr-3 flex py-3 pr-1.5"
                >
                  <kbd className="hover:bg-opacity-90 inline-flex items-center rounded-lg border border-gray-400 px-2 text-xs font-medium shadow-inner">
                    ⌘ + /
                  </kbd>
                </button>
              </SearchKeyIcon>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      {isExpanded && (
        <AnimatePresence>
          <motion.div
            className="bg-opacity-95 absolute z-20 mt-13 w-full rounded-xl border border-gray-300 bg-white shadow"
            key="content-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? (
              <LoadingWrapper>
                <div className="relative isolate flex w-full flex-row gap-3 p-3">
                  {/* Imagen/Carga del thumbnail */}
                  <div className="relative aspect-square w-12 shrink-0">
                    <div className="absolute inset-0 h-full w-full animate-pulse rounded-lg bg-gray-200" />
                  </div>

                  {/* Contenido del post */}
                  <div className="flex flex-1 flex-col space-y-4">
                    {/* Placeholder de descripción */}
                    <div className="h-4 w-full animate-pulse rounded-lg bg-gray-200" />
                    <div className="h-4 w-full animate-pulse rounded-lg bg-gray-200" />
                  </div>
                </div>
              </LoadingWrapper>
            ) : searchQuery.trim() === "" ? (
              // 1) Si no ha escrito nada → solo “Start typing…”
              <LoadingWrapper>
                <WarningMessage>Start typing to search</WarningMessage>
              </LoadingWrapper>
            ) : isEmpty ? (
              // 2) Si buscó pero no hay resultados → solo “Nothing to see…”
              <LoadingWrapper>
                <WarningMessage>Nothing to see here!</WarningMessage>
              </LoadingWrapper>
            ) : (
              // 3) Ya hay datos → muestro la lista
              <div className="max-h-60 overflow-y-auto">
                {products?.map(product => (
                  <Link
                    href={`/store/${product?.slug}`}
                    key={product?.id}
                    className="relative isolate flex w-full flex-row gap-3 p-3 hover:bg-gray-50"
                  >
                    {/* Imagen/Carga del thumbnail */}
                    <div className="relative aspect-square w-12 shrink-0">
                      <Image
                        width={512}
                        height={512}
                        alt={product?.title}
                        src={product?.thumbnail}
                        className="absolute inset-0 h-full w-full rounded-lg object-cover"
                      />
                    </div>

                    {/* Contenido del post */}
                    <div className="flex flex-1 flex-col">
                      {/* Placeholder de descripción */}
                      <h2 className="text-sm font-semibold">{product?.title}</h2>
                      <p className="text-xs">{product?.short_description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
