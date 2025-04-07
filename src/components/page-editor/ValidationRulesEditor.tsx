
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { ValidationRule } from '@/store/useStore';

interface ValidationRulesEditorProps {
  validationRules: ValidationRule[];
  onValidationRuleChange: (index: number, field: keyof ValidationRule, value: string) => void;
  onAddValidationRule: () => void;
  onRemoveValidationRule: (index: number) => void;
  canEdit: boolean;
  pageId?: string;
}

const ValidationRulesEditor: React.FC<ValidationRulesEditorProps> = ({
  validationRules,
  onValidationRuleChange,
  onAddValidationRule,
  onRemoveValidationRule,
  canEdit,
  pageId
}) => {
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle>Validation Rules</CardTitle>
        {canEdit && (
          <Button variant="outline" size="sm" onClick={onAddValidationRule}>
            <Plus size={14} className="mr-1" /> Add Rule
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule</th>
                {canEdit && (
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {validationRules.map((rule, index) => (
                <tr key={rule.id}>
                  <td className="px-4 py-2">
                    {canEdit ? (
                      <input
                        type="text"
                        value={rule.description}
                        onChange={(e) => onValidationRuleChange(index, 'description', e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      <span className="text-sm">{rule.description}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {canEdit ? (
                      <input
                        type="text"
                        value={rule.field}
                        onChange={(e) => onValidationRuleChange(index, 'field', e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      <span className="text-sm">{rule.field}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {canEdit ? (
                      <input
                        type="text"
                        value={rule.rule}
                        onChange={(e) => onValidationRuleChange(index, 'rule', e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      <span className="text-sm">{rule.rule}</span>
                    )}
                  </td>
                  {canEdit && (
                    <td className="px-4 py-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveValidationRule(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={14} />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}

              {validationRules.length === 0 && (
                <tr>
                  <td colSpan={canEdit ? 4 : 3} className="px-4 py-4 text-center text-gray-500">
                    No validation rules defined for this page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValidationRulesEditor;
