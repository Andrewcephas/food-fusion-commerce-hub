
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminCredentialsInfo from '@/components/admin/AdminCredentialsInfo';

const AdminLogin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  const handleLoginSuccess = () => {
    // Force navigation after a brief delay to allow auth state to update
    setTimeout(() => {
      navigate('/admin');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <p className="text-gray-600">Kenya Eats Management System</p>
        </CardHeader>
        <CardContent>
          <AdminLoginForm onSuccess={handleLoginSuccess} />
          <AdminCredentialsInfo />
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
