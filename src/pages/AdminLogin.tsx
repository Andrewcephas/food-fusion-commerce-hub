
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminCredentialsInfo from '@/components/admin/AdminCredentialsInfo';

const AdminLogin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleLoginSuccess = () => {
    // Force navigation after a brief delay to allow auth state to update
    setTimeout(() => {
      navigate('/admin');
    }, 500);
  };

  const handleSkipLogin = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
          <p className="text-gray-600">Kenya Eats Management System</p>
        </CardHeader>
        <CardContent>
          <AdminLoginForm onSuccess={handleLoginSuccess} />
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-800">Testing Mode:</h3>
            <p className="text-sm text-blue-600 mb-3">Admin access is open for testing purposes.</p>
            <Button 
              onClick={handleSkipLogin}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Continue to Admin Dashboard
            </Button>
          </div>
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
