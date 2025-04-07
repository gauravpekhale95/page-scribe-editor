
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Editor from '@monaco-editor/react';

interface JsonEditorProps {
  jsonContent: string;
  onJsonChange: (value: string | undefined) => void;
  canEdit: boolean;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ jsonContent, onJsonChange, canEdit }) => {
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'raw'

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>JSON Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="form">Form View</TabsTrigger>
            <TabsTrigger value="raw">Raw JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="form">
            <p className="text-sm text-gray-500 mb-4">
              Form view is not implemented in this demo. Switch to Raw JSON to edit.
            </p>
          </TabsContent>
          <TabsContent value="raw" className="h-[300px] border rounded-md">
            <Editor
              height="300px"
              defaultLanguage="json"
              value={jsonContent}
              onChange={onJsonChange}
              options={{
                minimap: { enabled: false },
                readOnly: !canEdit
              }}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default JsonEditor;
