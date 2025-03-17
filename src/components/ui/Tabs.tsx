import React, { ReactNode, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// Tipos para las Props de los componentes
interface TabsProps {
  children: ReactNode;
  defaultValue: string;
}

interface TabsListProps {
  children: ReactNode;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
}

interface TabsTriggerProps {
  value: string;
  activeTab: string;
  setActiveTab: (value: string) => void;
  children: ReactNode;
}

interface TabsContentProps {
  value: string;
  activeTab?: string;
  children: ReactNode;
}

// Componente raíz de Tabs
const Tabs: React.FC<TabsProps> = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultValue);

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<TabsListProps | TabsContentProps>(child)) {
          const childType = child.type as any;
          if (childType.displayName === "TabsList") {
            return React.cloneElement(child, { activeTab, setActiveTab });
          }
          if (childType.displayName === "TabsContent") {
            return React.cloneElement(child, { activeTab });
          }
        }
        return child;
      })}
    </>
  );
};

// Lista de pestañas
const TabsList: React.FC<TabsListProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <View style={styles.tabsList}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<TabsTriggerProps>(child)) {
          // Asegúrate de pasar las propiedades necesarias a cada TabsTrigger
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </View>
  );
};
TabsList.displayName = "TabsList";

// Componente de un solo tab
const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, activeTab, setActiveTab, children }) => {
  const isActive = activeTab === value;

  return (
    <TouchableOpacity
      onPress={() => setActiveTab(value)}
      style={[styles.tabsTrigger, isActive && styles.activeTab]}
    >
      <Text style={[styles.tabsTriggerText, isActive && styles.activeTabText]}>{children}</Text>
    </TouchableOpacity>
  );
};
TabsTrigger.displayName = "TabsTrigger";

// Contenido de cada tab
const TabsContent: React.FC<TabsContentProps> = ({ value, activeTab, children }) => {
  return activeTab === value ? <View style={styles.tabsContent}>{children}</View> : null;
};
TabsContent.displayName = "TabsContent";

// Exportar los componentes
export { Tabs, TabsList, TabsTrigger, TabsContent };

// Estilos
const styles = StyleSheet.create({
  tabsList: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 4,
    marginTop: 4
  },
  tabsTrigger: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: "#ff7f50",
  },
  tabsTriggerText: {
    fontSize: 16,
    color: "#333",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tabsContent: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
